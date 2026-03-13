import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";

export default function SettingsPanel() {
  const { t } = useI18n();
  const { user, nsfwFilterEnabled, setNsfwFilterEnabled } = useAuth();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-bold text-foreground">{t("settings")}</h2>
        <p className="text-sm text-muted-foreground">{t("settingsDesc")}</p>
      </div>

      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">{t("nsfwFilter")}</p>
            <p className="text-xs text-muted-foreground">{t("nsfwFilterDesc")}</p>
          </div>
          <Switch
            checked={nsfwFilterEnabled}
            onCheckedChange={(checked) => setNsfwFilterEnabled(checked)}
            disabled={!user}
          />
        </div>
        {!user && (
          <p className="text-xs text-muted-foreground">
            {t("settingsLoginToChange")}
          </p>
        )}
      </div>
    </div>
  );
}
