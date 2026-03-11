import React, { useRef } from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const CameraCapture = ({ language, onImageCapture, isAnalyzing }) => {
  const fileInputRef = useRef(null);

  const labels = {
    en: {
      title: "Scan Your Crop",
      subtitle: "Point your camera at affected leaves for instant disease detection",
      takePhoto: "Take Photo",
      uploadPhoto: "Upload from Gallery",
      tip: "Tip: Get close to affected leaves — clear focus gives better results.",
      offline: "Works offline — AI model runs on your device",
    },
    sw: {
      title: "Changanua Mazao Yako",
      subtitle: "Elekeza kamera kwenye majani yaliyoathirika kwa utambuzi wa haraka",
      takePhoto: "Piga Picha",
      uploadPhoto: "Pakia kutoka Galari",
      tip: "Kidokezo: Karibia majani yaliyoathirika — picha wazi inatoa matokeo bora.",
      offline: "Inafanya kazi nje ya mtandao — mfano wa AI unafanya kazi kwenye kifaa chako",
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
    <div className="flex flex-col items-center gap-5 md:gap-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)] font-[var(--font-heading)] tracking-tight">
          {t?.title}
        </h2>
        <p className="text-sm md:text-base text-[var(--color-muted-foreground)] mt-1.5 max-w-xs mx-auto leading-relaxed">
          {t?.subtitle}
        </p>
      </div>

      {/* Camera Zone */}
      <div
        className="camera-zone w-full max-w-sm md:max-w-md aspect-square rounded-3xl flex flex-col items-center justify-center gap-5 cursor-pointer select-none"
        onClick={() => fileInputRef?.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e?.key === "Enter" && fileInputRef?.current?.click()}
        aria-label={t?.takePhoto}
      >
        {/* Camera icon with ring */}
        <div className="camera-icon-ring w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
            <Icon name="Camera" size={38} color="var(--color-primary)" strokeWidth={1.5} />
          </div>
        </div>
        <div className="text-center px-4">
          <p className="text-[var(--color-primary)] font-bold text-lg md:text-xl">
            {t?.takePhoto}
          </p>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1">{t?.uploadPhoto}</p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Camera input for crop photo"
      />

      {/* Action Button */}
      <div className="w-full max-w-sm md:max-w-md">
        <button
          disabled={isAnalyzing}
          onClick={() => fileInputRef?.current?.click()}
          className="btn-gradient w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="Camera" size={20} color="white" strokeWidth={2} />
          {t?.takePhoto}
        </button>
      </div>

      {/* Tip box */}
      <div className="tip-box flex items-start gap-2.5 px-4 py-3 max-w-sm md:max-w-md w-full">
        <Icon name="Lightbulb" size={18} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs md:text-sm text-[var(--color-foreground)] font-medium">{t?.tip}</p>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1 flex items-center gap-1">
            <Icon name="Wifi" size={11} color="var(--color-success)" />
            {t?.offline}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
