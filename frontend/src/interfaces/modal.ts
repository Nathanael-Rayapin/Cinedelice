interface IModalOptions {
  type: 'draft' | 'preview';
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