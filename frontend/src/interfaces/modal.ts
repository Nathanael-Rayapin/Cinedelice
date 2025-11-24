interface IModalOptions {
  type: 'preview' | 'default';
}

export interface IModalPreview extends IModalOptions {
  image: string;
}

export interface IModalDefault extends IModalOptions {
  title: string;
  description: string;
  cancelButtonContent: string;
  confirmButtonContent: string;
  onConfirm: () => Promise<void>;
}