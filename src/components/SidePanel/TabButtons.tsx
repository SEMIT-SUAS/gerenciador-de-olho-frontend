type TabButtonsProps = {
  denunciasAmount: number;
  acoesAmount: number;
  currentTab: 'denuncias' | 'acoes';
  setCurrentTab: (currentTab: 'denuncias' | 'acoes') => void;
};

export function TabButtons({
  denunciasAmount,
  acoesAmount,
  currentTab,
  setCurrentTab,
}: TabButtonsProps) {
  return (
    <nav className="flex">
      <button
        onClick={() => setCurrentTab('denuncias')}
        className={`flex-1 p-4 text-center font-medium ${
          currentTab === 'denuncias'
            ? 'text-blue-600  border-b-2 border-blue-600'
            : 'text-gray-500'
        }`}
      >
        Denúncias ({denunciasAmount})
      </button>
      <button
        onClick={() => setCurrentTab('acoes')}
        className={`flex-1 p-4 text-center font-medium ${
          currentTab === 'acoes'
            ? 'text-green-600 border-b-2 border-green-600'
            : 'text-gray-500'
        }`}
      >
        Ações ({acoesAmount})
      </button>
    </nav>
  );
}
