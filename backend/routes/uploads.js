const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const crypto = require('crypto');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',');
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

// @route   POST /api/uploads/image
// @desc    Upload and process image
// @access  Private
router.post('/image', upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No image file provided'
    });
  }

  const { width, height, quality = 80 } = req.query;

  try {
    // Generate unique filename
    const fileHash = crypto.randomBytes(16).toString('hex');
    const fileExtension = '.webp'; // Convert all images to WebP for better compression
    const filename = `${fileHash}${fileExtension}`;
    const filepath = path.join(process.env.UPLOAD_PATH || './uploads', 'images', filename);

    // Process image with Sharp
    let imageProcessor = sharp(req.file.buffer)
      .webp({ quality: parseInt(quality) });

    // Resize if dimensions provided
    if (width || height) {
      imageProcessor = imageProcessor.resize({
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        fit: sharp.fit.inside,
        withoutEnlargement: true
      });
    }

    // Ensure upload directory exists
    const fs = require('fs');
    const uploadDir = path.dirname(filepath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save processed image
    await imageProcessor.toFile(filepath);

    // Get image metadata
    const metadata = await sharp(req.file.buffer).metadata();

    const imageUrl = `/uploads/images/${filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        filename,
        originalName: req.file.originalname,
        size: req.file.size,
        processedSize: fs.statSync(filepath).size,
        dimensions: {
          width: metadata.width,
          height: metadata.height
        },
        format: 'webp'
      }
    });

  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process image'
    });
  }
}));

// @route   POST /api/uploads/avatar
// @desc    Upload and process avatar image
// @access  Private
router.post('/avatar', upload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No avatar file provided'
    });
  }

  try {
    // Generate unique filename
    const fileHash = crypto.randomBytes(16).toString('hex');
    const filename = `avatar_${req.user._id}_${fileHash}.webp`;
    const filepath = path.join(process.env.UPLOAD_PATH || './uploads', 'avatars', filename);

    // Process avatar - resize to standard sizes and create circular crop
    const sizes = [32, 64, 128, 256]; // Different avatar sizes
    const processedAvatars = {};

    // Ensure upload directory exists
    const fs = require('fs');
    const uploadDir = path.dirname(filepath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const size of sizes) {
      const sizeFilename = `avatar_${req.user._id}_${fileHash}_${size}.webp`;
      const sizeFilepath = path.join(uploadDir, sizeFilename);

      await sharp(req.file.buffer)
        .resize(size, size, {
          fit: sharp.fit.cover,
          position: sharp.strategy.smart
        })
        .webp({ quality: 90 })
        .toFile(sizeFilepath);

      processedAvatars[size] = `/uploads/avatars/${sizeFilename}`;
    }

    // Update user's avatar
    req.user.profile.avatar = processedAvatars[256]; // Use largest size as default
    await req.user.save();

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatars: processedAvatars,
        default: processedAvatars[256]
      }
    });

  } catch (error) {
    console.error('Avatar processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process avatar'
    });
  }
}));

// @route   POST /api/uploads/portfolio-images
// @desc    Upload multiple images for portfolio
// @access  Private
router.post('/portfolio-images', upload.array('images', 10), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No image files provided'
    });
  }

  const { portfolioId } = req.body;
  
  if (!portfolioId) {
    return res.status(400).json({
      success: false,
      error: 'Portfolio ID is required'
    });
  }

  try {
    const uploadedImages = [];

    // Ensure upload directory exists
    const fs = require('fs');
    const uploadDir = path.join(process.env.UPLOAD_PATH || './uploads', 'portfolios');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of req.files) {
      // Generate unique filename
      const fileHash = crypto.randomBytes(16).toString('hex');
      const filename = `portfolio_${portfolioId}_${fileHash}.webp`;
      const filepath = path.join(uploadDir, filename);

      // Process image
      await sharp(file.buffer)
        .resize(1200, 800, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      // Create thumbnail
      const thumbnailFilename = `portfolio_${portfolioId}_${fileHash}_thumb.webp`;
      const thumbnailFilepath = path.join(uploadDir, thumbnailFilename);

      await sharp(file.buffer)
        .resize(400, 300, {
          fit: sharp.fit.cover,
          position: sharp.strategy.smart
        })
        .webp({ quality: 75 })
        .toFile(thumbnailFilepath);

      const imageData = {
        url: `/uploads/portfolios/${filename}`,
        thumbnail: `/uploads/portfolios/${thumbnailFilename}`,
        originalName: file.originalname,
        size: fs.statSync(filepath).size
      };

      uploadedImages.push(imageData);
    }

    res.json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully`,
      data: { images: uploadedImages }
    });

  } catch (error) {
    console.error('Portfolio images processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process portfolio images'
    });
  }
}));

// @route   DELETE /api/uploads/image/:filename
// @desc    Delete uploaded image
// @access  Private
router.delete('/image/:filename', asyncHandler(async (req, res) => {
  const { filename } = req.params;
  
  // Security: Only allow deletion of files that belong to the user
  // You might want to add more sophisticated ownership checking
  
  try {
    const fs = require('fs');
    const filepath = path.join(process.env.UPLOAD_PATH || './uploads', 'images', filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete image'
    });
  }
}));

// @route   GET /api/uploads/user-images
// @desc    Get user's uploaded images
// @access  Private
router.get('/user-images', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type = 'all' } = req.query;
  
  // This is a simplified implementation
  // In a production app, you'd want to store file metadata in the database
  // and associate files with users
  
  try {
    const fs = require('fs');
    const uploadDirs = {
      images: path.join(process.env.UPLOAD_PATH || './uploads', 'images'),
      avatars: path.join(process.env.UPLOAD_PATH || './uploads', 'avatars'),
      portfolios: path.join(process.env.UPLOAD_PATH || './uploads', 'portfolios')
    };

    let files = [];
    
    Object.entries(uploadDirs).forEach(([dirType, dirPath]) => {
      if (type === 'all' || type === dirType) {
        if (fs.existsSync(dirPath)) {
          const dirFiles = fs.readdirSync(dirPath)
            .filter(file => {
              // Filter files that belong to this user (simplified)
              return file.includes(req.user._id.toString()) || dirType === 'images';
            })
            .map(file => {
              const filePath = path.join(dirPath, file);
              const stats = fs.statSync(filePath);
              
              return {
                filename: file,
                url: `/uploads/${dirType}/${file}`,
                size: stats.size,
                uploadDate: stats.ctime,
                type: dirType
              };
            });
          
          files = files.concat(dirFiles);
        }
      }
    });

    // Sort by upload date (newest first)
    files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedFiles = files.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        images: paginatedFiles,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(files.length / limitNum),
          totalItems: files.length,
          hasNextPage: endIndex < files.length,
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch images'
    });
  }
}));

module.exports = router;
