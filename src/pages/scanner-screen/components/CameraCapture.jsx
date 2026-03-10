import React, { useRef } from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const CameraCapture = ({ language, onImageCapture, isAnalyzing }) => {
  const fileInputRef = useRef(null);

  const labels = {
    en: {
      title: "Scan Your Crop",
      subtitle: "Take a photo of your crop to identify diseases instantly",
      takePhoto: "Take Photo",
      uploadPhoto: "Upload from Gallery",
      tip: "Tip: Get close to the affected leaves for better results",
    },
    sw: {
      title: "Changanua Mazao Yako",
      subtitle: "Piga picha ya mazao yako kutambua magonjwa mara moja",
      takePhoto: "Piga Picha",
      uploadPhoto: "Pakia kutoka Galari",
      tip: "Kidokezo: Karibia majani yaliyoathirika kwa matokeo bora",
    },
  };

  const t = labels?.[language] || labels?.en;

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => onImageCapture(img, file, ev?.target?.result);
      img.src = ev?.target?.result;
    };
    reader?.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[var(--color-foreground)] font-[var(--font-heading)]">
          {t?.title}
        </h2>
        <p className="text-sm md:text-base text-[var(--color-muted-foreground)] mt-1 max-w-sm mx-auto">
          {t?.subtitle}
        </p>
      </div>
      {/* Camera Icon Area */}
      <div
        className="w-full max-w-sm md:max-w-md aspect-square rounded-2xl border-2 border-dashed border-[var(--color-primary)] bg-[var(--color-muted)] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[rgba(45,125,50,0.05)] transition-all"
        onClick={() => fileInputRef?.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e?.key === "Enter" && fileInputRef?.current?.click()}
        aria-label={t?.takePhoto}
      >
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[rgba(45,125,50,0.12)] flex items-center justify-center">
          <Icon name="Camera" size={40} color="var(--color-primary)" strokeWidth={1.5} />
        </div>
        <p className="text-[var(--color-primary)] font-semibold text-base md:text-lg">
          {t?.takePhoto}
        </p>
      </div>
      {/* Hidden file input with camera capture */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Camera input for crop photo"
      />
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm md:max-w-md">
        <Button
          variant="default"
          size="lg"
          fullWidth
          iconName="Camera"
          iconPosition="left"
          disabled={isAnalyzing}
          onClick={() => fileInputRef?.current?.click()}
        >
          {t?.takePhoto}
        </Button>
      </div>
      <div className="flex items-start gap-2 bg-[rgba(255,143,0,0.1)] border border-[rgba(255,143,0,0.3)] rounded-xl px-4 py-3 max-w-sm md:max-w-md w-full">
        <Icon name="Lightbulb" size={18} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-[var(--color-foreground)]">{t?.tip}</p>
      </div>
    </div>
  );
};

export default CameraCapture;