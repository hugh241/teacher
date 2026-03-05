export const ACCEPT_CONFIG = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
  video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv'],
  document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt'],
  getAll() {
    return [...this.image, ...this.video, ...this.document]
  },
  getVideo() {
    return [...this.video]
  },
};
export const UPLOAD_TYPE = {
  image: ["jpg", "JPG", "png", "PNG", "jpeg", "JPEG", "bmp", "BMP", "webp", "WEBP"],
  video: ["mp4", "MP4", "mp3", "MP3"],
  document: ["doc", "DOC", "docx", "DOCX", "pdf", "PDF", "ppt", "PPT", "pptx", "PPTX", "xls", "XLS", "xlsx", "XLSX", "pptx", "PPTX"],
  getAll() {
    return [...this.image, ...this.video, ...this.document]
  },
  getVideo() {
    return [...this.video]
  },
};