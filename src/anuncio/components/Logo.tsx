import React from "react";
import { Img } from "remotion";
import { optionalStaticFile } from "../lib/static";
import { colors, fonts } from "../theme";

// Logo de public/logo.png, usada só na cena final. O avatar do chat (`avatar`)
// mostra sempre as iniciais "CA"; sem o arquivo, a cena final também mostra "CA".
export const Logo: React.FC<{ size: number; avatar?: boolean }> = ({
  size,
  avatar = false,
}) => {
  const src = avatar ? null : optionalStaticFile("logo.png");

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

  return (
    <Img
      src={src}
      style={{ height: size, maxWidth: size * 3.5, objectFit: "contain" }}
    />
  );
};
