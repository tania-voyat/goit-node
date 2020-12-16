const Avatar = require("avatar-builder");
const fs = require("fs");
const path = require("path");

async function generateAvatar() {
  const avatarName = "avatar" + Date.now() + ".png";
  await Avatar.builder(
    Avatar.Image.compose(Avatar.Image.fillStyle("#FAFAFA"), Avatar.Image.cat()),
    256,
    256
  )
    .create("avatar")
    .then((buffer) => fs.writeFileSync("tmp/" + avatarName, buffer));
  await fs.rename(
    path.join("tmp/" + avatarName),
    path.join("public/images/" + avatarName),
    (err) => {
      console.log(err);
    }
  );
  return avatarName;
}

module.exports = generateAvatar;
