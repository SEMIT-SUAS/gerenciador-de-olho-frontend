import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import { Card, CardContent } from '../../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { RenderIf } from '../../../components/RenderIf';
import { IconCategoryFilled } from '@tabler/icons-react';
import { ImageSkeleton } from '../../../components/Loading/ImageSkeleton';
import { ListItemSkeleton } from '../../../components/Loading/ListItemSkeleton';
import { CategoryDenunciaItem } from './CategoryDenunciaItem';
import type { Dispatch, SetStateAction } from 'react';

interface CategoriasDenunciaListProps {
  categories: CategoriaDenunciaModel[] | null;
  setCategories: Dispatch<SetStateAction<CategoriaDenunciaModel[] | null>>;
  itemsPerPage: number;
}

export function CategoriasDenunciaList({
  categories,
  setCategories,
  itemsPerPage,
}: CategoriasDenunciaListProps) {
  return (
    <Card className="py-0">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Icone</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Destaque</TableHead>
                <TableHead className="w-[10%]">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories ? (
                <RenderIf
                  condition={categories.length > 0}
                  ifRender={categories?.map((category) => (
                    <CategoryDenunciaItem
                      key={category.id}
                      category={category}
                      setCategories={setCategories}
                    />
                  ))}
                  elseRender={
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <IconCategoryFilled className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Nenhuma categoria encontrada
                          </h3>
                        </div>
                      </TableCell>
                    </TableRow>
                  }
                />
              ) : (
                Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    <TableCell className="border-r">
                      <div className="flex items-center gap-3">
                        <ImageSkeleton
                          height={40}
                          width={40}
                          className="rounded"
                        />
                        <ListItemSkeleton
                          titleWidth="20"
                          className="p-0 border-0"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="border-r">
                      <ListItemSkeleton
                        titleWidth="3/4"
                        className="p-0 border-0"
                      />
                    </TableCell>

                    <TableCell className="border-r">
                      <ListItemSkeleton
                        titleWidth="1/2"
                        className="p-0 border-0"
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-4">
                        <ImageSkeleton
                          height={24}
                          width={24}
                          className="rounded-full"
                        />
                        <ImageSkeleton
                          height={24}
                          width={24}
                          className="rounded-full"
                        />
                        <ImageSkeleton
                          height={24}
                          width={24}
                          className="rounded-full"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
