

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

// Check for existing UUID in local storage or create a new one
export const getLocalStorageUuid = () => {

  let uuid = localStorage.getItem("syncboard_uuid");
  if (!uuid) {
    uuid = uuidv4();
    localStorage.setItem("syncboard_uuid", uuid);
  }
  return uuid;
};
