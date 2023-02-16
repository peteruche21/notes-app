import type { FC, PropsWithChildren } from "react";

const Modal: FC<PropsWithChildren<{ docid: string }>> = ({
  children,
  docid,
}) => {
  return (
    <div>
      <input type="checkbox" id={docid} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor={docid}
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
