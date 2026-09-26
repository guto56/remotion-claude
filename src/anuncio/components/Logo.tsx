import React from "react";
import { Img } from "remotion";
import { optionalStaticFile } from "../lib/static";
import { colors, fonts } from "../theme";

// Logo de public/logo.png. Se o arquivo não existir, mostra as iniciais "CA".
export const Logo: React.FC<{ size: number; avatar?: boolean }> = ({
  size,
  avatar = false,
}) => {
  const src = optionalStaticFile("logo.png");

  if (!src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          background: avatar ? colors.brand : colors.white,
          color: avatar ? colors.white : colors.brand,
          fontFamily: fonts.title,
          fontWeight: 800,
          fontSize: size * 0.4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        CA
      </div>
    );
  }

  if (avatar) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          background: colors.white,
          border: `2px solid ${colors.clientBorder}`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Img
          src={src}
          style={{ width: "80%", height: "80%", objectFit: "contain" }}
        />
      </div>
    );
  }

  return (
    <Img
      src={src}
      style={{ height: size, maxWidth: size * 3.5, objectFit: "contain" }}
    />
  );
};
