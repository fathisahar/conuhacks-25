import { FileUpload } from "primereact/fileupload";

const DeckUpload() => {
    return (
      <div>
      <Toast ref={toast}></Toast>
      <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} />
      </div>
    );
  };
  
  export default DeckUpload;