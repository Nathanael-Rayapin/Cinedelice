interface IModalOptions {
  type: 'draft' | 'preview' | 'delete';
}

export interface IModalPreview extends IModalOptions {
  image: string;
}

export interface IModalDraft extends IModalOptions {
  title: string;
  description: string;
  draftData: FormData;
  cancelButtonContent: string;
  confirmButtonContent: string;
}

export interface IModalDelete extends IModalOptions {
  title: string;
  description: string;
  cancelButtonContent: string;
  confirmButtonContent: string;
  onConfirm: () => Promise<void>;
}