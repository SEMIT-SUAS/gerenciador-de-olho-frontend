import { useEffect, useState } from 'react';
import { LayoutPage } from '../../components/LayoutPage';
import { personaService } from '@/services/personaService';
import type { Persona } from '@/types/Persona';
import { FormPersona } from './components/PersonasForms';
import PageHeader from '@/components/PageHeader';
import { TableHeaderActions } from '@/components/TableHeaderActions';
import { Pagination } from '@/components/Pagination';
import { PersonasList } from './components/PersonaList';

export function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[] | null>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  useEffect(() => {
    personaService.getAll().then((personasData) => {
      if (personasData) {
        setPersonas(personasData);
      }
    });

    return () => {
      setPersonas([]);
    };
  }, []);

  function handleEdit(persona: Persona) {
    setSelectedPersona(persona);
    setIsEditModalOpen(true);
  }

  const filteredPersonas = personas?.filter((persona) =>
    persona.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((filteredPersonas?.length ?? 0) / itemsPerPage);

  const currentPersonas = personas
    ? filteredPersonas?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ) || []
    : [];

  const itemsPerPageOptions = [8, 16, 24];

  return (
    <LayoutPage>
      <div className="flex flex-col gap-4 py-4 px-4 sm:gap-5 sm:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-36">
        <PageHeader
          title="Personas"
          description="Gerencie as personas relacionadas aos serviços da prefeitura, mantendo registros completos, atualizados e disponíveis a qualquer momento."
        />
        <TableHeaderActions
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          buttonText="Adicionar Persona"
          onButtonClick={() => setIsCreateModalOpen(true)}
        />

        <PersonasList
          itemsPerPage={itemsPerPage}
          personas={currentPersonas}
          setPersonas={setPersonas}
          onEdit={handleEdit}
        />

        <Pagination
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      </div>
      {isCreateModalOpen && (
        <FormPersona
          mode="create"
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={async () => {
            setIsCreateModalOpen(false);
            const newData = await personaService.getAll();
            if (newData) {
              setPersonas(newData);
            }
          }}
        />
      )}
      {isEditModalOpen && selectedPersona && (
        <FormPersona
          mode="edit"
          defaultValues={selectedPersona}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPersona(null);
          }}
          onSuccess={async () => {
            setIsEditModalOpen(false);
            setSelectedPersona(null);
            const newData = await personaService.getAll();
            if (newData) {
              setPersonas(newData);
            }
          }}
        />
      )}
    </LayoutPage>
  );
}
