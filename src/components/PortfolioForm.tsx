import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, X, Github, ExternalLink, Upload, FileText, Download, Eye, Trash2, Image, Video, Music, File, Camera } from "lucide-react";
import { PortfolioData, Project, Document, MediaFile } from "@/types/portfolio";

interface PortfolioFormProps {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
}

const PortfolioForm = ({ data, onChange }: PortfolioFormProps) => {
  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    description: "",
    technologies: [],
    liveUrl: "",
    githubUrl: ""
  });
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [documentPreview, setDocumentPreview] = useState<Document | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{[key: string]: 'uploading' | 'success' | 'error'}>({});
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const updateData = <K extends keyof PortfolioData>(field: K, value: PortfolioData[K]) => {
    onChange({ ...data, [field]: value });
  };

  // Utility functions for file handling
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (mimeType.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>, documentType?: Document['type']) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const fileId = `${file.name}-${Date.now()}`;
      setUploadStatus(prev => ({ ...prev, [fileId]: 'uploading' }));
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Validate file type based on button clicked
      const isValidType = validateFileType(file, 'document');
      if (!isValidType) {
        setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
        alert(`❌ Invalid file type: ${file.type}\n\nPlease select a valid document file:\n• PDF files (.pdf)\n• Word documents (.doc, .docx)\n• Text files (.txt, .rtf)\n• Excel files (.xls, .xlsx)\n• PowerPoint (.ppt, .pptx)`);
        return;
      }

      // Check file size (limit to 10MB for documents)
      if (file.size > 10 * 1024 * 1024) {
        setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
        alert(`❌ File too large: ${formatFileSize(file.size)}\n\nMaximum file size is 10MB. Please compress your document or choose a smaller file.`);
        return;
      }

      const reader = new FileReader();
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        }
      };

      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newDocument: Document = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name.split('.')[0],
          type: documentType || determineDocumentType(file),
          filename: file.name,
          fileSize: file.size,
          mimeType: file.type,
          content,
          uploadDate: new Date(),
          isPublic: documentType === 'cv' || documentType === 'resume', // CV/Resume public by default
          description: documentType === 'cv' ? 'Primary Resume/CV document' : undefined
        };
        
        const currentDocuments = data.documents || [];
        updateData("documents", [...currentDocuments, newDocument]);
        
        // Auto-set as primary resume if it's a CV and no primary exists
        if ((documentType === 'cv' || documentType === 'resume') && !data.resumeId) {
          updateData("resumeId", newDocument.id);
        }

        setUploadStatus(prev => ({ ...prev, [fileId]: 'success' }));
        
        // Show success message
        setTimeout(() => {
          alert(`✅ Document uploaded successfully!\n\n📄 ${file.name}\n📁 Type: ${(documentType || 'other').toUpperCase()}\n💾 Size: ${formatFileSize(file.size)}`);
          setUploadStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[fileId];
            return newStatus;
          });
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 1000);
      };

      reader.onerror = () => {
        setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
        alert(`❌ Failed to upload ${file.name}\n\nPlease try again or contact support if the problem persists.`);
      };

      reader.readAsDataURL(file);
    });
    event.target.value = ''; // Reset input
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, mediaType?: 'image' | 'video' | 'audio') => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    files.forEach(file => {
      const fileId = `${file.name}-${Date.now()}`;
      setUploadStatus(prev => ({ ...prev, [fileId]: 'uploading' }));
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Validate file type based on button clicked
      const isValidType = mediaType ? validateFileType(file, mediaType) : validateFileType(file, 'media');
      if (!isValidType) {
        setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
        const typeMap = {
          image: 'Image files: JPG, PNG, GIF, WebP, SVG, BMP',
          video: 'Video files: MP4, WebM, AVI, MOV, WMV, FLV, MKV',
          audio: 'Audio files: MP3, WAV, OGG, M4A, AAC, FLAC, WMA'
        };
        const expectedTypes = mediaType ? typeMap[mediaType] : 'Images, Videos, or Audio files';
        alert(`❌ Invalid file type: ${file.type}\n\nPlease select valid ${mediaType || 'media'} files:\n• ${expectedTypes}`);
        return;
      }

      // Check file size limits
      const maxSize = mediaType === 'video' ? 100 * 1024 * 1024 : 25 * 1024 * 1024; // 100MB for video, 25MB for others
      if (file.size > maxSize) {
        setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
        alert(`❌ File too large: ${formatFileSize(file.size)}\n\nMaximum file size is ${formatFileSize(maxSize)}. Please compress your ${mediaType || 'media'} file.`);
        return;
      }

      const reader = new FileReader();
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        }
      };

      reader.onload = (e) => {
        const content = e.target?.result as string;
        let detectedType: 'image' | 'video' | 'audio' | 'document' = 'document';
        
        if (mediaType) {
          detectedType = mediaType;
        } else {
          if (file.type.startsWith('image/')) detectedType = 'image';
          else if (file.type.startsWith('video/')) detectedType = 'video';
          else if (file.type.startsWith('audio/')) detectedType = 'audio';
        }

        const newMedia: MediaFile = {
          id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name.split('.')[0],
          type: detectedType,
          filename: file.name,
          fileSize: file.size,
          mimeType: file.type,
          content,
          uploadDate: new Date(),
          tags: [detectedType, 'portfolio'],
          description: `${detectedType.charAt(0).toUpperCase() + detectedType.slice(1)} file uploaded from device`
        };
        
        const currentMedia = data.media || [];
        updateData("media", [...currentMedia, newMedia]);

        setUploadStatus(prev => ({ ...prev, [fileId]: 'success' }));
        
        // Show success message
        setTimeout(() => {
          alert(`✅ Media uploaded successfully!\n\n🎯 ${file.name}\n📂 Type: ${detectedType.toUpperCase()}\n💾 Size: ${formatFileSize(file.size)}`);
          setUploadStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[fileId];
            return newStatus;
          });
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 1000);
      };

      reader.onerror = () => {
        setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
        alert(`❌ Failed to upload ${file.name}\n\nPlease try again or contact support if the problem persists.`);
      };

      reader.readAsDataURL(file);
    });
    event.target.value = ''; // Reset input
  };

  const handleCameraCapture = async () => {
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('📷 Camera not available\n\nYour device or browser does not support camera access. Please upload an image file instead.');
        return;
      }

      // Show loading indicator
      const loadingModal = document.createElement('div');
      loadingModal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;';
      loadingModal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; max-width: 300px;">
          <div style="font-size: 48px; margin-bottom: 20px;">📷</div>
          <h3 style="margin: 0 0 15px 0; color: #333;">Requesting Camera Access</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">Please allow camera access when prompted by your browser</p>
          <div style="margin-top: 20px;">
            <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
          </div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      document.body.appendChild(loadingModal);

      // Request camera access with better configuration
      const constraints = {
        video: {
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          facingMode: 'user', // Start with front camera
          frameRate: { ideal: 30 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Remove loading modal
      document.body.removeChild(loadingModal);
      
      // Create enhanced camera interface
      const modal = document.createElement('div');
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1000; padding: 20px;';
      
      const container = document.createElement('div');
      container.style.cssText = 'background: white; padding: 20px; border-radius: 15px; text-align: center; max-width: 500px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.3);';
      
      const title = document.createElement('h3');
      title.textContent = '📷 Camera Capture';
      title.style.cssText = 'margin: 0 0 20px 0; color: #333; font-size: 24px;';
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.muted = true;
      video.style.cssText = 'width: 100%; max-width: 400px; border-radius: 10px; background: #000; box-shadow: 0 4px 12px rgba(0,0,0,0.3);';
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = 'display: flex; gap: 15px; justify-content: center; margin-top: 20px; flex-wrap: wrap;';
      
      // Capture button
      const captureBtn = document.createElement('button');
      captureBtn.innerHTML = '📸 Capture Photo';
      captureBtn.style.cssText = 'padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; min-width: 140px;';
      
      // Switch camera button
      const switchBtn = document.createElement('button');
      switchBtn.innerHTML = '🔄 Switch Camera';
      switchBtn.style.cssText = 'padding: 12px 24px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(240, 147, 251, 0.4); transition: all 0.3s ease; min-width: 140px;';
      
      // Cancel button
      const cancelBtn = document.createElement('button');
      cancelBtn.innerHTML = '❌ Cancel';
      cancelBtn.style.cssText = 'padding: 12px 24px; background: linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(252, 74, 26, 0.4); transition: all 0.3s ease; min-width: 140px;';
      
      // Add hover effects
      [captureBtn, switchBtn, cancelBtn].forEach(btn => {
        btn.onmouseenter = () => btn.style.transform = 'translateY(-2px) scale(1.05)';
        btn.onmouseleave = () => btn.style.transform = 'translateY(0) scale(1)';
      });
      
      // Instructions
      const instructions = document.createElement('p');
      instructions.innerHTML = '💡 <strong>Tip:</strong> Make sure you have good lighting and look directly at the camera';
      instructions.style.cssText = 'margin: 15px 0 5px 0; color: #666; font-size: 14px; background: #f8f9fa; padding: 10px; border-radius: 8px; border-left: 4px solid #007bff;';
      
      container.appendChild(title);
      container.appendChild(video);
      container.appendChild(instructions);
      
      buttonContainer.appendChild(captureBtn);
      buttonContainer.appendChild(switchBtn);
      buttonContainer.appendChild(cancelBtn);
      container.appendChild(buttonContainer);
      
      modal.appendChild(container);
      document.body.appendChild(modal);
      
      let currentFacingMode = 'user';
      
      // Handle camera switch
      switchBtn.onclick = async () => {
        try {
          stream.getTracks().forEach(track => track.stop());
          currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
          
          const newConstraints = {
            video: {
              width: { ideal: 1920, max: 1920 },
              height: { ideal: 1080, max: 1080 },
              facingMode: currentFacingMode,
              frameRate: { ideal: 30 }
            }
          };
          
          const newStream = await navigator.mediaDevices.getUserMedia(newConstraints);
          video.srcObject = newStream;
        } catch (error) {
          console.error('Camera switch error:', error);
          switchBtn.textContent = '⚠️ Switch Failed';
          setTimeout(() => switchBtn.innerHTML = '🔄 Switch Camera', 2000);
        }
      };
      
      // Handle capture
      captureBtn.onclick = () => {
        // Add capture animation
        captureBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        captureBtn.innerHTML = '✅ Capturing...';
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0);
        
        // Add flash effect
        const flash = document.createElement('div');
        flash.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: white; opacity: 0.8; pointer-events: none;';
        container.appendChild(flash);
        setTimeout(() => container.removeChild(flash), 100);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            
            // Simulate file input event
            const fakeEvent = {
              target: {
                files: [file],
                value: ''
              }
            } as React.ChangeEvent<HTMLInputElement>;
            
            handleMediaUpload(fakeEvent, 'image');
            
            // Show success message
            captureBtn.innerHTML = '📸 Photo Captured!';
            setTimeout(() => {
              stream.getTracks().forEach(track => track.stop());
              document.body.removeChild(modal);
            }, 1500);
          }
        }, 'image/jpeg', 0.9);
      };
      
      // Handle cancel
      cancelBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };
      
      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(modal);
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);
      
    } catch (error) {
      // Remove loading modal if it exists
      const existingLoading = document.querySelector('[style*="Requesting Camera Access"]')?.parentElement?.parentElement;
      if (existingLoading) {
        document.body.removeChild(existingLoading);
      }
      
      console.error('Camera access error:', error);
      
      let errorMessage = '📷 Camera Access Denied\n\n';
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Camera permission was denied. Please:\n• Click the camera icon in your browser\'s address bar\n• Allow camera access for this site\n• Refresh the page and try again';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on your device.\nPlease upload an image file instead.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.\nPlease close other apps using the camera and try again.';
      } else {
        errorMessage += 'Camera access failed. Please upload an image file instead.';
      }
      
      alert(errorMessage);
    }
  };

  const handleDeviceMediaPicker = async (mediaType: 'image' | 'video' | 'audio' | 'document' | 'all') => {
    setIsRequestingPermission(true);
    try {
      // Show loading modal while requesting permissions
      const loadingModal = document.createElement('div');
      loadingModal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;';
      loadingModal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; max-width: 400px;">
          <div style="font-size: 48px; margin-bottom: 20px;">📱</div>
          <h3 style="margin: 0 0 15px 0; color: #333;">Requesting Device Access</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">Please allow file access when prompted by your browser</p>
          <div style="margin-top: 20px;">
            <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
          </div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      document.body.appendChild(loadingModal);

      // Check if the File System Access API is available (for advanced file picking)
      if ('showOpenFilePicker' in window) {
        interface FilePickerAcceptType {
          description: string;
          accept: Record<string, string[]>;
        }
        
        let fileTypes: FilePickerAcceptType[] = [];
        let startDirectory: 'pictures' | 'documents' | 'videos' | 'music' = 'pictures';
        
        switch (mediaType) {
          case 'image':
            fileTypes = [{
              description: 'Image files',
              accept: {
                'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.ico', '.heic', '.raw']
              }
            }];
            startDirectory = 'pictures';
            break;
          case 'video':
            fileTypes = [{
              description: 'Video files',
              accept: {
                'video/*': ['.mp4', '.webm', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.m4v', '.3gp', '.ogv']
              }
            }];
            startDirectory = 'videos';
            break;
          case 'audio':
            fileTypes = [{
              description: 'Audio files',
              accept: {
                'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.wma', '.opus', '.amr']
              }
            }];
            startDirectory = 'music';
            break;
          case 'document':
            fileTypes = [{
              description: 'Document files',
              accept: {
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'text/plain': ['.txt'],
                'application/rtf': ['.rtf'],
                'application/vnd.ms-excel': ['.xls'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                'application/vnd.ms-powerpoint': ['.ppt'],
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
              }
            }];
            startDirectory = 'documents';
            break;
          case 'all':
          default:
            fileTypes = [
              {
                description: 'All media and documents',
                accept: {
                  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.heic'],
                  'video/*': ['.mp4', '.webm', '.avi', '.mov', '.wmv', '.flv', '.mkv'],
                  'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.wma'],
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                }
              }
            ];
            startDirectory = 'pictures';
        }

        // Show enhanced file picker with proper options
        const fileHandles = await (window as unknown as { 
          showOpenFilePicker: (options: { 
            types: FilePickerAcceptType[], 
            multiple: boolean, 
            startIn: string,
            excludeAcceptAllOption?: boolean 
          }) => Promise<{ getFile: () => Promise<File> }[]> 
        }).showOpenFilePicker({
          types: fileTypes,
          multiple: true,
          startIn: startDirectory,
          excludeAcceptAllOption: false
        });

        // Remove loading modal
        document.body.removeChild(loadingModal);

        // Process selected files with detailed feedback
        let processedCount = 0;
        const totalFiles = fileHandles.length;
        
        for (const fileHandle of fileHandles) {
          try {
            const file = await fileHandle.getFile();
            processedCount++;
            
            // Show progress for multiple files
            if (totalFiles > 1) {
              console.log(`Processing file ${processedCount}/${totalFiles}: ${file.name}`);
            }
            
            // Validate file size before processing
            const maxSize = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 
                           file.type.startsWith('image/') ? 25 * 1024 * 1024 : 
                           10 * 1024 * 1024;
            
            if (file.size > maxSize) {
              alert(`❌ File too large: ${file.name}\nSize: ${formatFileSize(file.size)}\nMaximum allowed: ${formatFileSize(maxSize)}`);
              continue;
            }
            
            // Determine if it's media or document and handle accordingly
            if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
              const fakeEvent = {
                target: {
                  files: [file],
                  value: ''
                }
              } as React.ChangeEvent<HTMLInputElement>;
              
              const detectedMediaType = file.type.startsWith('image/') ? 'image' : 
                                     file.type.startsWith('video/') ? 'video' : 'audio';
              await handleMediaUpload(fakeEvent, detectedMediaType as 'image' | 'video' | 'audio');
            } else {
              // Handle as document
              const fakeEvent = {
                target: {
                  files: [file],
                  value: ''
                }
              } as React.ChangeEvent<HTMLInputElement>;
              await handleDocumentUpload(fakeEvent, 'other');
            }
          } catch (fileError) {
            console.error('Error processing file:', fileError);
            alert(`❌ Failed to process file: ${fileHandle.name || 'Unknown'}`);
          }
        }

        if (fileHandles.length > 0) {
          const successMessage = `✅ Successfully processed ${processedCount}/${totalFiles} file(s) from your device!\n\n` +
            `📊 Summary:\n` +
            `• Selected: ${totalFiles} files\n` +
            `• Processed: ${processedCount} files\n` +
            `• Failed: ${totalFiles - processedCount} files`;
          alert(successMessage);
        }

      } else {
        // Remove loading modal for fallback
        document.body.removeChild(loadingModal);
        
        // Enhanced fallback to traditional file input with better UX
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.style.display = 'none';
        
        // Create a promise to handle the file selection
        const fileSelectionPromise = new Promise<FileList | null>((resolve) => {
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            resolve(files);
          };
          
          // Handle cancel (no files selected)
          input.oncancel = () => resolve(null);
          
          // Fallback for older browsers that don't support oncancel
          setTimeout(() => {
            if (!input.files) {
              resolve(null);
            }
          }, 30000); // 30 second timeout
        });
        
        switch (mediaType) {
          case 'image':
            input.accept = 'image/*';
            input.setAttribute('capture', 'environment'); // Enable camera for mobile
            break;
          case 'video':
            input.accept = 'video/*';
            input.setAttribute('capture', 'camcorder'); // Enable video recording
            break;
          case 'audio':
            input.accept = 'audio/*';
            input.setAttribute('capture', 'microphone'); // Enable audio recording
            break;
          case 'document':
            input.accept = '.pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx';
            break;
          case 'all':
          default:
            input.accept = 'image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.rtf';
        }
        
        // Add to DOM and trigger click
        document.body.appendChild(input);
        input.click();
        
        // Wait for file selection
        const selectedFiles = await fileSelectionPromise;
        
        // Clean up
        document.body.removeChild(input);
        
        if (selectedFiles && selectedFiles.length > 0) {
          const files = Array.from(selectedFiles);
          let processedCount = 0;
          
          for (const file of files) {
            try {
              // Validate file size
              const maxSize = file.type.startsWith('video/') ? 100 * 1024 * 1024 : 
                             file.type.startsWith('image/') ? 25 * 1024 * 1024 : 
                             10 * 1024 * 1024;
              
              if (file.size > maxSize) {
                alert(`❌ File too large: ${file.name}\nSize: ${formatFileSize(file.size)}\nMaximum allowed: ${formatFileSize(maxSize)}`);
                continue;
              }
              
              if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
                const fakeEvent = {
                  target: { files: [file], value: '' }
                } as React.ChangeEvent<HTMLInputElement>;
                
                const detectedMediaType = file.type.startsWith('image/') ? 'image' : 
                                       file.type.startsWith('video/') ? 'video' : 'audio';
                await handleMediaUpload(fakeEvent, detectedMediaType as 'image' | 'video' | 'audio');
              } else {
                const fakeEvent = {
                  target: { files: [file], value: '' }
                } as React.ChangeEvent<HTMLInputElement>;
                await handleDocumentUpload(fakeEvent, 'other');
              }
              processedCount++;
            } catch (fileError) {
              console.error('Error processing file:', fileError);
            }
          }
          
          if (processedCount > 0) {
            alert(`✅ Successfully processed ${processedCount}/${files.length} file(s) from your device!`);
          }
        }
      }
    } catch (error) {
      // Remove loading modal if it exists
      const existingLoading = document.querySelector('[style*="Requesting Device Access"]')?.parentElement?.parentElement;
      if (existingLoading) {
        document.body.removeChild(existingLoading);
      }
      
      if (error.name === 'AbortError') {
        // User cancelled, show friendly message
        console.log('User cancelled file selection');
        return;
      }
      
      console.error('Device media picker error:', error);
      
      let errorMessage = '❌ Failed to access device files\n\n';
      if (error.name === 'SecurityError') {
        errorMessage += 'Security restriction detected. Please:\n• Use HTTPS connection\n• Allow file access permissions\n• Try using individual upload buttons';
      } else if (error.name === 'NotAllowedError') {
        errorMessage += 'File access was denied. Please:\n• Allow file access when prompted\n• Check browser permissions\n• Try again or use upload buttons';
      } else {
        errorMessage += 'Please try using the individual upload buttons instead.';
      }
      
      alert(errorMessage);
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const requestStoragePermission = async () => {
    try {
      // Request persistent storage permission
      if ('storage' in navigator && 'persist' in navigator.storage) {
        const permission = await navigator.storage.persist();
        console.log('Storage persistence granted:', permission);
      }
      
      // Check storage quota
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        console.log('Storage estimate:', estimate);
        
        if (estimate.quota && estimate.usage) {
          const usagePercentage = (estimate.usage / estimate.quota) * 100;
          if (usagePercentage > 80) {
            alert('⚠️ Storage Warning\n\nYour device storage is running low. Consider freeing up space for better performance.');
          }
        }
      }
    } catch (error) {
      console.log('Storage permission request failed:', error);
    }
  };

  // Request storage permission when component mounts
  useEffect(() => {
    requestStoragePermission();
  }, []);

  // File type validation
  const validateFileType = (file: File, expectedType: 'document' | 'image' | 'video' | 'audio' | 'media'): boolean => {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/rtf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'];
    const videoTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/mkv'];
    const audioTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac', 'audio/flac', 'audio/wma'];

    switch (expectedType) {
      case 'document':
        return documentTypes.includes(file.type);
      case 'image':
        return imageTypes.includes(file.type);
      case 'video':
        return videoTypes.includes(file.type);
      case 'audio':
        return audioTypes.includes(file.type);
      case 'media':
        return [...imageTypes, ...videoTypes, ...audioTypes].includes(file.type);
      default:
        return false;
    }
  };

  // Determine document type based on filename and content
  const determineDocumentType = (file: File): Document['type'] => {
    const fileName = file.name.toLowerCase();
    if (fileName.includes('cv') || fileName.includes('resume')) return 'cv';
    if (fileName.includes('certificate') || fileName.includes('cert')) return 'certificate';
    if (fileName.includes('transcript')) return 'transcript';
    if (fileName.includes('portfolio')) return 'portfolio';
    return 'other';
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    const currentDocuments = data.documents || [];
    const updatedDocuments = currentDocuments.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    );
    updateData("documents", updatedDocuments);
  };

  const deleteDocument = (id: string) => {
    const currentDocuments = data.documents || [];
    updateData("documents", currentDocuments.filter(doc => doc.id !== id));
  };

  const deleteMedia = (id: string) => {
    const currentMedia = data.media || [];
    updateData("media", currentMedia.filter(media => media.id !== id));
  };

  const downloadFile = (file: Document | MediaFile) => {
    const link = window.document.createElement('a');
    link.href = file.content;
    link.download = file.filename;
    link.click();
  };

  const openDocument = (doc: Document) => {
    setDocumentPreview(doc);
  };

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      updateData("skills", [...data.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    updateData("skills", data.skills.filter(s => s !== skill));
  };

  const addProject = () => {
    if (newProject.title && newProject.description) {
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title,
        description: newProject.description,
        technologies: newProject.technologies || [],
        liveUrl: newProject.liveUrl,
        githubUrl: newProject.githubUrl
      };
      updateData("projects", [...data.projects, project]);
      setNewProject({
        title: "",
        description: "",
        technologies: [],
        liveUrl: "",
        githubUrl: ""
      });
    }
  };

  const removeProject = (id: string) => {
    updateData("projects", data.projects.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => updateData("name", e.target.value)}
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => updateData("title", e.target.value)}
            placeholder="Full Stack Developer"
          />
        </div>
        
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={data.bio}
            onChange={(e) => updateData("bio", e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <Label>Skills</Label>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button onClick={addSkill} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <Label>Projects</Label>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Add New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={newProject.title || ""}
              onChange={(e) => setNewProject({...newProject, title: e.target.value})}
              placeholder="Project title"
            />
            <Textarea
              value={newProject.description || ""}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              placeholder="Project description"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={newProject.liveUrl || ""}
                onChange={(e) => setNewProject({...newProject, liveUrl: e.target.value})}
                placeholder="Live URL (optional)"
              />
              <Input
                value={newProject.githubUrl || ""}
                onChange={(e) => setNewProject({...newProject, githubUrl: e.target.value})}
                placeholder="GitHub URL (optional)"
              />
            </div>
            <Button onClick={addProject} size="sm" className="w-full">
              Add Project
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {data.projects.map((project) => (
            <Card key={project.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{project.title}</h4>
                  <X 
                    className="h-4 w-4 cursor-pointer hover:text-destructive" 
                    onClick={() => removeProject(project.id)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <Badge variant="outline" className="text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  )}
                  {project.githubUrl && (
                    <Badge variant="outline" className="text-xs">
                      <Github className="h-3 w-3 mr-1" />
                      Code
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <Label>Contact Information</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            value={data.contact.email}
            onChange={(e) => updateData("contact", {...data.contact, email: e.target.value})}
            placeholder="Email"
            type="email"
          />
          <Input
            value={data.contact.github}
            onChange={(e) => updateData("contact", {...data.contact, github: e.target.value})}
            placeholder="GitHub username"
          />
          <Input
            value={data.contact.linkedin}
            onChange={(e) => updateData("contact", {...data.contact, linkedin: e.target.value})}
            placeholder="LinkedIn username"
          />
          <Input
            value={data.contact.website}
            onChange={(e) => updateData("contact", {...data.contact, website: e.target.value})}
            placeholder="Personal website"
          />
        </div>
      </div>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documents & Resume
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Device Document Picker */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              📄 Quick Document Access
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Browse and select documents directly from your device
            </p>
            <div className="bg-green-100 border-l-4 border-green-500 p-3 mb-3 rounded">
              <div className="flex items-start">
                <div className="text-green-500 text-lg mr-2">📄</div>
                <div className="text-sm text-green-700">
                  <strong>Supported formats:</strong> PDF, Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx), and text files. Maximum file size: 10MB per document.
                </div>
              </div>
            </div>
            <Button 
              size="lg"
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handleDeviceMediaPicker('document')}
              disabled={isRequestingPermission}
            >
              {isRequestingPermission ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  🔄 Requesting Access...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  📱 Browse Device Documents
                </>
              )}
            </Button>
          </div>

          {/* Traditional Upload Buttons */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-700 mb-3">Or upload specific document types:</h4>
          <div className="flex flex-wrap gap-3">
            <label className="cursor-pointer">
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-300 border-2 text-blue-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Upload className="w-5 h-5" />
                📄 Upload CV/Resume
              </Button>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleDocumentUpload(e, 'cv')}
                title="Select PDF, DOC, or DOCX files for your resume/CV"
              />
            </label>
            
            <label className="cursor-pointer">
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border-green-300 border-2 text-green-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Upload className="w-5 h-5" />
                🏆 Upload Certificate
              </Button>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => handleDocumentUpload(e, 'certificate')}
                title="Select certificate files (PDF, images, or documents)"
              />
            </label>

            <label className="cursor-pointer">
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 border-purple-300 border-2 text-purple-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Upload className="w-5 h-5" />
                📋 Upload Document
              </Button>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx"
                multiple
                onChange={(e) => handleDocumentUpload(e, 'other')}
                title="Select any document files (PDF, Office docs, text files)"
              />
            </label>

            <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 border-yellow-300 border-2 text-yellow-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  🔗 Add Document URL
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Document from URL</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Document URL (e.g., Google Drive link)" />
                  <Input placeholder="Document Name" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Document Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cv">CV/Resume</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="transcript">Transcript</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full">Add Document</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          </div>

          {/* Upload Progress Indicators for Documents */}
          {Object.keys(uploadStatus).length > 0 && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700">Upload Progress</h4>
              {Object.entries(uploadStatus).map(([fileId, status]) => {
                const fileName = fileId.split('-')[0];
                const progress = uploadProgress[fileId] || 0;
                return (
                  <div key={fileId} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="truncate">{fileName}</span>
                        <span className={`font-medium ${
                          status === 'success' ? 'text-green-600' : 
                          status === 'error' ? 'text-red-600' : 
                          'text-blue-600'
                        }`}>
                          {status === 'uploading' ? `${Math.round(progress)}%` : 
                           status === 'success' ? '✅ Complete' : 
                           status === 'error' ? '❌ Failed' : status}
                        </span>
                      </div>
                      {status === 'uploading' && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Documents List */}
          <div className="space-y-3">
            {(data.documents || []).map((doc) => (
              <Card key={doc.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(doc.mimeType)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{doc.name}</span>
                        <Badge variant={doc.type === 'cv' ? 'default' : 'secondary'}>
                          {doc.type.toUpperCase()}
                        </Badge>
                        {data.resumeId === doc.id && (
                          <Badge variant="default">Primary Resume</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {doc.filename} • {formatFileSize(doc.fileSize)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openDocument(doc)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadFile(doc)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    {doc.type === 'cv' && (
                      <Button 
                        size="sm" 
                        variant={data.resumeId === doc.id ? "default" : "outline"}
                        onClick={() => updateData("resumeId", data.resumeId === doc.id ? undefined : doc.id)}
                      >
                        {data.resumeId === doc.id ? "Primary" : "Set Primary"}
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Document Details */}
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Select 
                      value={doc.type} 
                      onValueChange={(value: Document['type']) => updateDocument(doc.id, { type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cv">CV/Resume</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="transcript">Transcript</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={doc.isPublic}
                        onChange={(e) => updateDocument(doc.id, { isPublic: e.target.checked })}
                      />
                      <label className="text-sm">Public</label>
                    </div>
                  </div>
                  <Input
                    placeholder="Description (optional)"
                    value={doc.description || ""}
                    onChange={(e) => updateDocument(doc.id, { description: e.target.value })}
                  />
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Media Library Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Media Library
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Device Media Picker - Primary Action */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              📱 Quick Device Access
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Access photos, videos, and documents directly from your device with one click
            </p>
            <div className="bg-blue-100 border-l-4 border-blue-500 p-3 mb-3 rounded">
              <div className="flex items-start">
                <div className="text-blue-500 text-lg mr-2">💡</div>
                <div className="text-sm text-blue-700">
                  <strong>How it works:</strong> Click the buttons below to browse your device files. Your browser will ask for permission to access your files - please allow this to enable direct file selection from your device folders.
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                size="lg"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleDeviceMediaPicker('all')}
                disabled={isRequestingPermission}
              >
                {isRequestingPermission ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    🔄 Requesting Access...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    📱 Browse Device Files
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border-green-300 border-2 text-green-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => handleDeviceMediaPicker('image')}
                disabled={isRequestingPermission}
              >
                {isRequestingPermission ? (
                  <>
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    🔄 Requesting...
                  </>
                ) : (
                  <>
                    <Image className="w-5 h-5" />
                    📷 Device Photos
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-300 border-2 text-red-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => handleDeviceMediaPicker('video')}
                disabled={isRequestingPermission}
              >
                {isRequestingPermission ? (
                  <>
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    🔄 Requesting...
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5" />
                    🎬 Device Videos
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Traditional Upload Buttons */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-700 mb-3">Or upload specific file types:</h4>
          <div className="flex flex-wrap gap-3">
            <label className="cursor-pointer">
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 border-pink-300 border-2 text-pink-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Image className="w-5 h-5" />
                📸 Upload Images
              </Button>
              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
                multiple
                onChange={(e) => handleMediaUpload(e, 'image')}
                title="Select image files (JPG, PNG, GIF, WebP, SVG, BMP)"
              />
            </label>
            
            <label className="cursor-pointer">
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-300 border-2 text-red-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Video className="w-5 h-5" />
                🎥 Upload Videos
              </Button>
              <input
                type="file"
                className="hidden"
                accept=".mp4,.webm,.avi,.mov,.wmv,.flv,.mkv"
                multiple
                onChange={(e) => handleMediaUpload(e, 'video')}
                title="Select video files (MP4, WebM, AVI, MOV, WMV)"
              />
            </label>

            <label className="cursor-pointer">
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border-indigo-300 border-2 text-indigo-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Music className="w-5 h-5" />
                🎵 Upload Audio
              </Button>
              <input
                type="file"
                className="hidden"
                accept=".mp3,.wav,.ogg,.m4a,.aac,.flac,.wma"
                multiple
                onChange={(e) => handleMediaUpload(e, 'audio')}
                title="Select audio files (MP3, WAV, OGG, M4A, AAC, FLAC)"
              />
            </label>

            <label className="cursor-pointer">
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 border-teal-300 border-2 text-teal-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <File className="w-5 h-5" />
                📁 Upload Any Media
              </Button>
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*,audio/*"
                multiple
                onChange={(e) => handleMediaUpload(e)}
                title="Select any media files (images, videos, audio)"
              />
            </label>

            <Button 
              variant="outline" 
              size="lg"
              className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border-orange-300 border-2 text-orange-700 font-medium shadow-sm hover:shadow-md transition-all duration-200"
              onClick={handleCameraCapture}
            >
              <Video className="w-5 h-5" />
              📷 Capture from Camera
            </Button>
          </div>
          </div>

          {/* Upload Progress Indicators */}
          {Object.keys(uploadStatus).length > 0 && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700">Upload Progress</h4>
              {Object.entries(uploadStatus).map(([fileId, status]) => {
                const fileName = fileId.split('-')[0];
                const progress = uploadProgress[fileId] || 0;
                return (
                  <div key={fileId} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="truncate">{fileName}</span>
                        <span className={`font-medium ${
                          status === 'success' ? 'text-green-600' : 
                          status === 'error' ? 'text-red-600' : 
                          'text-blue-600'
                        }`}>
                          {status === 'uploading' ? `${Math.round(progress)}%` : 
                           status === 'success' ? '✅ Complete' : 
                           status === 'error' ? '❌ Failed' : status}
                        </span>
                      </div>
                      {status === 'uploading' && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Media Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(data.media || []).map((media) => (
              <Card key={media.id} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {media.type === 'image' ? (
                    <img 
                      src={media.content} 
                      alt={media.name}
                      className="w-full h-full object-cover"
                      onClick={() => window.open(media.content, '_blank')}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      {getFileIcon(media.mimeType)}
                      <span className="text-xs mt-1">{media.type.toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-2">
                  <div className="text-sm font-medium truncate">{media.name}</div>
                  <div className="text-xs text-gray-500">{formatFileSize(media.fileSize)}</div>
                  <div className="flex justify-between mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadFile(media)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteMedia(media.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      {documentPreview && (
        <Dialog open={!!documentPreview} onOpenChange={() => setDocumentPreview(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getFileIcon(documentPreview.mimeType)}
                {documentPreview.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              {documentPreview.mimeType === 'application/pdf' ? (
                <iframe
                  src={documentPreview.content}
                  className="w-full h-[60vh]"
                  title={documentPreview.name}
                />
              ) : documentPreview.mimeType.startsWith('image/') ? (
                <img 
                  src={documentPreview.content} 
                  alt={documentPreview.name}
                  className="max-w-full h-auto"
                />
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                  <Button 
                    className="mt-4"
                    onClick={() => downloadFile(documentPreview)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download to View
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PortfolioForm;