import type { BannerModel } from '@/types/Banner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RenderIf } from '@/components/RenderIf';
import { BannerItem } from './BannerItem';
import type { Dispatch, SetStateAction } from 'react';
import { ImageSkeleton } from '@/components/Loading/ImageSkeleton';
import { ListItemSkeleton } from '@/components/Loading/ListItemSkeleton';
import { IconPhotoOff } from '@tabler/icons-react';

type BannerListProps = {
  banners: BannerModel[] | null;
  itemsPerPage: number;
  setBanners: Dispatch<SetStateAction<BannerModel[] | null>>;
};

export function BannersList({
  itemsPerPage,
  banners,
  setBanners,
}: BannerListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Imagem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className="w-[120px]">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {banners ? (
            <RenderIf
              condition={banners.length > 0}
              ifRender={banners?.map((banner) => (
                <BannerItem
                  key={banner.id}
                  banner={banner}
                  setBanners={setBanners}
                />
              ))}
              elseRender={
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <IconPhotoOff className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nenhum banner encontrado
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
                    <ImageSkeleton height={40} width={40} className="rounded" />
                    <ListItemSkeleton
                      titleWidth="20"
                      className="p-0 border-0"
                    />
                  </div>
                </TableCell>

                <TableCell className="border-r">
                  <ListItemSkeleton titleWidth="3/4" className="p-0 border-0" />
                </TableCell>

                <TableCell className="border-r">
                  <ListItemSkeleton titleWidth="1/2" className="p-0 border-0" />
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
  );
}
