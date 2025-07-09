import { useState } from "react";
import type { Acao } from "../types/Acao";
import { createContext, type ReactNode, type FC, useContext  } from "react";

type InteractionMode = 'idle' | 'addingDenuncia' | 'linkingToAcao';
type ClickedCoords = { latitude: number; longitude: number; } | null;

interface MapInteractionContextType {
    mode: InteractionMode;
    startInteraction: (newMode: InteractionMode) => void;
    endInteraction: () => void;
    clickedCoords: ClickedCoords;
    setClickedCoords: (coords: ClickedCoords) => void;
    selectedItem: Acao | null; // Usado para passar a Ação selecionada no mapa
    setSelectedItem: (item: Acao | null) => void;
}

export const MapInteractionContext = createContext<MapInteractionContextType | undefined>(undefined);

export const MapInteractionProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<InteractionMode>('idle');
    const [clickedCoords, setClickedCoords] = useState<ClickedCoords>(null);
    const [selectedItem, setSelectedItem] = useState<Acao | null>(null);

    const startInteraction = (newMode: InteractionMode) => {
        setMode(newMode);
        setClickedCoords(null); // Reseta as coordenadas ao iniciar uma nova interação
        setSelectedItem(null);
    };

    const endInteraction = () => {
        setMode('idle');
        setClickedCoords(null);
        setSelectedItem(null);
    };

    const value = { mode, startInteraction, endInteraction, clickedCoords, setClickedCoords, selectedItem, setSelectedItem };

    return <MapInteractionContext.Provider value={value}>{children}</MapInteractionContext.Provider>;
};

export const useMapInteractionContext = () => {
    const context = useContext(MapInteractionContext);
    if (!context) throw new Error('useMapInteractionContext deve ser usado dentro de um MapInteractionProvider');
    return context;
};