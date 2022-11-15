import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function App() {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);

  const selectImage = (file) => {
    setSrc(URL.createObjectURL(file));
  };

  const cropImageNow = () => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    // Converting to base64
    const base64Image = canvas.toDataURL('image/png');
    setOutput(base64Image);
    canvas.toBlob(
      blob => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = 'some';
        // window.URL.revokeObjectURL(this.fileUrl);
        // this.fileUrl = window.URL.createObjectURL(blob);
        console.log(URL.createObjectURL(blob))
        console.log(new File([blob], "fileName.jpg", { type: "image/png" }))
        setSrc(URL.createObjectURL(new File([blob], "fileName.jpg", { type: "image/png" })))
      },
      "image/png",
      1
    )
  };

  return (
    <div className="App">
      <center>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            selectImage(e.target.files[0]);
          }}
        />
        <br />
        <br />
        <div>
          {src && (
            <div>
              <ReactCrop
                crop={crop}
                onChange={setCrop}
              >
                <img
                  alt="for_crop"
                  onLoad={(e) => setImage(e.target)}
                  src={src}
                />
              </ReactCrop>
              <br />
              <button onClick={cropImageNow}>Crop</button>
              <br />
              <br />
            </div>
          )}
        </div>
        <div>{output && <img src={output} alt="img2" />}</div>
      </center>
    </div>
  );
}

export default App;