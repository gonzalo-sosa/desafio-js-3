export function saveBlobToLocalStorage(blob, key) {
  const reader = new FileReader();
  reader.onload = function () {
    localStorage.setItem(key, reader.result);
  };
  reader.readAsDataURL(blob);
}

export function loadBlobFromLocalStorage(key, type) {
  const base64Data = localStorage.getItem(key);
  if (!base64Data) {
    return null;
  }

  const byteCh = atob(base64Data.split(',')[1]);
  const byteN = new Uint8Array(byteCh.length);
  for (const i in byteCh) {
    byteN[i] = byteCh.charCodeAt(i);
  }
  return new Blob([byteN], { type });
}
