import type { BannerModel } from '@/types/Banner';
import { TableCell, TableRow } from '@/components/ui/table';
import { BannerVisibility } from './BannerVisibility';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { toast } from 'sonner';
import { BannerService } from '@/services/bannersService';
import { EditBannerModal } from '@/pages/BannersPage/components/EditBannerModal';
import { textAliases } from '@/utils/textAliases';

type BannerItemProps = {
  banner: BannerModel;
  setBanners: Dispatch<SetStateAction<BannerModel[] | null>>;
};

export function BannerItem({ banner, setBanners }: BannerItemProps) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenEditBannerModal, setIsOpenEditBannerModal] = useState(false);

  async function handleDeleteBanner() {
    try {
      await new BannerService().trash(banner.id);

      setBanners(
        (prev) =>
          prev?.filter((prevBanner) => prevBanner.id !== banner.id) ?? null,
      );

      toast.success('Banner excluído com sucesso');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <TableRow key={banner.id}>
        <TableCell>
          <img
            src={banner.imagem}
            alt={banner.nome}
            className="h-14 w-auto rounded-md"
            loading="lazy"
          />
        </TableCell>
        <TableCell>{banner.nome}</TableCell>
        <TableCell>
          {banner.link && banner.link.length > 1 ? (
            <a
              href={banner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {textAliases(banner.link)}
            </a>
          ) : (
            <span>Sem link</span>
          )}
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsOpenEditBannerModal(true)}>
              <IconEdit stroke={2.3} size={18} />
            </button>

            <BannerVisibility banner={banner} setBanners={setBanners} />

            <button onClick={() => setIsOpenDeleteModal(true)}>
              <IconTrash stroke={2.3} size={18} />
            </button>
          </div>
        </TableCell>
      </TableRow>

      <ConfirmModal
        isOpen={isOpenDeleteModal}
        onConfirm={handleDeleteBanner}
        onCancel={() => setIsOpenDeleteModal(false)}
        title={`Tem certeza que deseja excluir o banner ${banner.nome}?`}
        message="Essa ação não pode ser desfeita."
      />

      <EditBannerModal
        isOpen={isOpenEditBannerModal}
        onClose={() => setIsOpenEditBannerModal(false)}
        setBanners={setBanners}
        bannerToEdit={banner}
      />
    </>
  );
}
