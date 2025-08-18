import { Card, CardContent } from '@/components/ui/card';
import { FilterAcaoSecretariaSelect } from './FilterAcaoSecretariaSelect';
import { FilterAcaoStatusSelect } from './FilterAcaoStatusSelect';
import { FilterDenunciaByCategoriaSelect } from './FilterDenunciaByCategoriaSelect';
import { FilterDenunciaByCategoriaTipoSelect } from './FilterDenunciaByCategoriaTipoSelect';
import { FilterDenunciaStatusSelect } from './FilterDenunciaStatusSelect';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import AcaoIcon from '/public/icons/acao.png';
import DenunciaIcon from '/public/icons/denuncia.png';
import { Button } from '@/components/ui/button';

export function MapFilters() {
  return (
    <div className="absolute z-20 px-12 py-9 w-full h-full">
      <div className="flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold">Filtros da denúncia</h2>

            <div className="flex gap-3">
              <FilterDenunciaByCategoriaSelect />
              <FilterDenunciaByCategoriaTipoSelect />
              <FilterDenunciaStatusSelect />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-end">Filtros da ação</h2>

            <div className="flex gap-3">
              <FilterAcaoStatusSelect />
              <FilterAcaoSecretariaSelect />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button className="w-56">
            Adicionar ação{' '}
            <img src={AcaoIcon} alt="Icone de denúncia" className="h-6 w-6" />
          </Button>

          <div className="space-y-3">
            <Card className={`w-24 ${cn('py-3')}`}>
              <CardContent
                className={`flex items-center justify-between ${cn('px-3')}`}
              >
                <img
                  src={DenunciaIcon}
                  alt="Icone de denúncia"
                  className="h-6 w-6"
                />

                <Switch />
              </CardContent>
            </Card>

            <Card className={`w-24 ${cn('py-3')}`}>
              <CardContent
                className={`flex items-center justify-between ${cn('px-3')}`}
              >
                <img
                  src={AcaoIcon}
                  alt="Icone de denúncia"
                  className="h-6 w-6"
                />

                <Switch />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
