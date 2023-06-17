import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Unfonts from "unplugin-fonts/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unfonts({
      custom: {
        families: [
          {
            /**
             * Name of the font family.
             */
            name: "London Underground",
            /**
             * Local name of the font. Used to add `src: local()` to `@font-rule`.
             */
            local: "London Underground",
            /**
             * Regex(es) of font files to import. The names of the files will
             * predicate the `font-style` and `font-weight` values of the `@font-rule`'s.
             */
            src: "./src/assets/font/*.ttf",

            transform(font) {
              if (font.basename === "London Underground Bold") {
                // update the font weight
                font.weight = 700;
              } else if (font.basename === "London Underground Heavy") {
                // update the font weight
                font.weight = 900;
              } else if (font.basename === "London Underground Medium") {
                // update the font weight
                font.weight = 500;
              } else {
                font.weight = 400;
              }

              // we can also return null to skip the font
              return font;
            },
          },
        ],

        display: "auto",
        preload: true,
        prefetch: false,
        injectTo: "head-prepend",
      },
    }),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8080/",
    },
  },
});
