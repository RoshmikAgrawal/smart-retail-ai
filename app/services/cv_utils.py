import os
import cv2
import numpy as np

class OpenCVImageProcessor:
    def __init__(self):
        # Resolve the built-in Haar Cascade XML path safely
        cv2_data = getattr(cv2, "data", None)
        cascade_dir = cv2_data.haarcascades if cv2_data else ""
        self.cascade_path = os.path.join(cascade_dir, 'haarcascade_frontalface_default.xml')
        
        # Safe execution check wrapper against OS application policy limits
        try:
            self.face_cascade = cv2.CascadeClassifier(self.cascade_path)
            self.cascade_ready = True
        except Exception:
            self.face_cascade = None
            self.cascade_ready = False

    def load_image_from_bytes(self, image_bytes: bytes) -> np.ndarray:
        """Converts raw uploaded binary stream arrays into an OpenCV image matrix."""
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Failed to decode image from bytes.")
        return img

    def to_grayscale(self, img: np.ndarray) -> np.ndarray:
        """Applies basic grayscaling matrix operation."""
        return cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    def resize_frame(self, img: np.ndarray, width: int = 640, height: int = 480) -> np.ndarray:
        """Resizes video frames or target processing images to fixed geometric limits."""
        return cv2.resize(img, (width, height), interpolation=cv2.INTER_AREA)

    def apply_blur(self, img: np.ndarray, kernel_size: int = 5) -> np.ndarray:
        """Applies a Gaussian Blur filter to suppress background high-frequency noise."""
        if kernel_size % 2 == 0:
            kernel_size += 1  # Kernel size must be an odd integer number
        return cv2.GaussianBlur(img, (kernel_size, kernel_size), 0)

    def detect_edges_canny(self, img: np.ndarray, low_threshold: int = 50, high_threshold: int = 150) -> np.ndarray:
        """Executes a structural Canny Edge Detection matrix extraction scan."""
        if len(img.shape) == 3:
            img = self.to_grayscale(img)
        return cv2.Canny(img, low_threshold, high_threshold)

    def extract_face_bounding_boxes(self, img: np.ndarray) -> list:
        """
        Scans pixel arrays via the Haar Cascade classifier tool.
        Returns a list of coordinate dictionaries containing bounding box markers: [x, y, w, h]
        """
        if not self.cascade_ready or self.face_cascade is None:
            return []
            
        gray = self.to_grayscale(img)
        detected_faces = self.face_cascade.detectMultiScale(
            gray, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(30, 30)
        )
        
        return [{"x": int(x), "y": int(y), "w": int(w), "h": int(h)} for (x, y, w, h) in detected_faces]

    def preprocess_for_classifier(self, img: np.ndarray) -> np.ndarray:
        """Module A2: Converts BGR matrix array to 224x224 RGB normalized batch tensor for MobileNetV2."""
        # 1. Convert color space from OpenCV default BGR to Model-expected RGB
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # 2. Match the exact 224x224 input resolution shape used in notebook training
        resized = cv2.resize(rgb_img, (224, 224), interpolation=cv2.INTER_AREA)
        
        # 3. Scale pixel boundaries to [0, 1] matching the notebook's float normalization
        normalized = resized.astype(np.float32) / 255.0
        
        # 4. Expand dimensions from (224, 224, 3) to batch tensor form (1, 224, 224, 3)
        return np.expand_dims(normalized, axis=0)