import React, { useState } from 'react';
import { Header } from '@/components/Header/Header';
import { InputPanel } from '@/components/InputPanel/InputPanel';
import { PreviewPanel } from '@/components/PreviewPanel';
import { SettingsDrawer } from '@/components/SettingsDrawer/SettingsDrawer';
import { useFormatStyles } from '@/hooks/useFormatStyles';
import { useExport } from '@/hooks/useExport';
import { useFormatConfig } from '@/stores/documentStore';
import './styles/global.css';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const formatConfig = useFormatConfig();
  const { isExporting, exportDocument } = useExport();

  // 应用 CSS 变量
  useFormatStyles(formatConfig);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExport={exportDocument}
        isExporting={isExporting}
      />

      <main
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          overflow: 'hidden',
          marginTop: '56px',
        }}
      >
        <InputPanel />
        <PreviewPanel />
      </main>

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
