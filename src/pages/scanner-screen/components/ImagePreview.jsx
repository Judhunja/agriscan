import React from "react";
import Image from "components/AppImage";

import Button from "components/ui/Button";

const ImagePreview = ({ imageSrc, language, onRetake, isAnalyzing }) => {
  const labels = {
    en: { preview: "Crop Preview", retake: "Retake Photo", analyzing: "Analyzing…" },
    sw: { preview: "Hakiki ya Mazao", retake: "Piga Tena Picha", analyzing: "Inachambua…" },
  };
  const t = labels?.[language] || labels?.en;

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-base md:text-lg font-semibold text-[var(--color-foreground)]">{t?.preview}</h3>
      <div className="w-full max-w-sm md:max-w-md aspect-square rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-md)] relative">
        <Image
          src={imageSrc}
          alt="Captured crop photo showing plant leaves for disease analysis and identification"
          className="w-full h-full object-cover"
        />
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 border-4 border-white border-t-[var(--color-primary)] rounded-full animate-spin" />
            <p className="text-white font-semibold text-sm">{t?.analyzing}</p>
          </div>
        )}
      </div>
      {!isAnalyzing && (
        <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left" onClick={onRetake}>
          {t?.retake}
        </Button>
      )}
    </div>
  );
};

export default ImagePreview;