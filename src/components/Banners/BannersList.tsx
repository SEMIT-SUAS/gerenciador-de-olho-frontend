import type { BannerModel } from '@/types/Banner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { RenderIf } from '../RenderIf';
import { SkeletonImage } from '../Loading/SkeletonImage';
import { SkeletonItem } from '../Loading/SkeletonItem';
import { BannerListItem } from './BannerListItem';
import type { Dispatch, SetStateAction } from 'react';

type BannerListProps = {
  searchTerm: string;
  banners: BannerModel[] | null;
  itemsPerPage: number;
  setBanners: Dispatch<SetStateAction<BannerModel[] | null>>;
};

export function BannersList({
  searchTerm,
  itemsPerPage,
  banners,
  setBanners,
}: BannerListProps) {
  return (
    <Table className="rounded-md overflow-hidden border border-solid shadow-lg">
      <TableHeader>
        <TableRow>
          <TableHead>Imagem</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Link</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {banners ? (
          <RenderIf
            condition={banners.length > 0}
            ifRender={banners?.map((banner) => (
              <BannerListItem
                key={banner.id}
                banner={banner}
                setBanners={setBanners}
              />
            ))}
            elseRender={
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center">
                  <p className="text-sm text-gray-500">
                    {searchTerm
                      ? `Nenhum resultado para "${searchTerm}"`
                      : 'Nenhum banner encontrado'}
                  </p>
                </TableCell>
              </TableRow>
            }
          />
        ) : (
          Array.from({ length: itemsPerPage }).map((_, idx) => (
            <TableRow key={`skeleton-${idx}`}>
              <TableCell className="border-r">
                <div className="flex items-center gap-3">
                  <SkeletonImage height={40} width={40} className="rounded" />
                  <SkeletonItem titleWidth="20" className="p-0 border-0" />
                </div>
              </TableCell>
              <TableCell className="border-r">
                <SkeletonItem titleWidth="3/4" className="p-0 border-0" />
              </TableCell>
              <TableCell className="border-r">
                <SkeletonItem titleWidth="1/2" className="p-0 border-0" />
              </TableCell>
              <TableCell>
                <div className="flex gap-4">
                  <SkeletonImage
                    height={24}
                    width={24}
                    className="rounded-full"
                  />
                  <SkeletonImage
                    height={24}
                    width={24}
                    className="rounded-full"
                  />
                  <SkeletonImage
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
  );
}
