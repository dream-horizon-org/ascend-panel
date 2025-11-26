import { FC, ReactNode, useCallback, cloneElement, isValidElement } from "react";
import Box from "@mui/material/Box";
import Modal, { ModalProps } from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { SxProps, Theme } from "@mui/material/styles";

export interface AscendModalConfig {
  // Modal content
  title?: string;
  description?: string;
  content?: ReactNode;
  children?: ReactNode;
  
  // Modal styling
  width?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  maxHeight?: number | string;
  
  // Modal behavior
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  
  // Custom styling
  sx?: SxProps<Theme>;
  boxSx?: SxProps<Theme>;
  
  // ARIA attributes
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  
  // Nested modal support (controlled by parent component)
  nestedModal?: AscendModalConfig;
  
  // Custom actions
  actions?: ReactNode;
  showCloseButton?: boolean;
  closeButtonText?: string;
  
  // Callbacks
  onOpen?: () => void;
  onClose?: () => void;
}

export interface AscendModalProps extends Omit<ModalProps, 'open' | 'onClose' | 'children'> {
  config: AscendModalConfig;
  open: boolean;
  onClose: () => void;
  onOpen?: () => void;
  trigger?: ReactNode;
  // Nested modal control (controlled by parent component)
  nestedModalOpen?: boolean;
  onNestedModalClose?: () => void;
  onNestedModalOpen?: () => void;
}

const defaultStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  maxHeight: '90vh',
  overflow: 'auto',
};

const AscendModal: FC<AscendModalProps> = ({
  config,
  open,
  onClose,
  onOpen: onOpenProp,
  trigger,
  nestedModalOpen = false,
  onNestedModalClose,
  onNestedModalOpen,
  ...modalProps
}) => {
  const {
    title,
    description,
    content,
    children,
    width = 400,
    maxWidth,
    height,
    maxHeight,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    sx,
    boxSx,
    ariaLabelledBy,
    ariaDescribedBy,
    nestedModal,
    actions,
    showCloseButton = true,
    closeButtonText = 'Close',
    onClose: onCloseCallback,
  } = config;

  const handleModalClose = useCallback((_event: {}, reason: string) => {
    if (reason === 'backdropClick' && !closeOnBackdropClick) {
      return;
    }
    if (reason === 'escapeKeyDown' && !closeOnEscape) {
      return;
    }
    onClose();
    onCloseCallback?.();
  }, [closeOnBackdropClick, closeOnEscape, onClose, onCloseCallback]);

  const modalStyle = {
    ...defaultStyle,
    width,
    ...(maxWidth && { maxWidth }),
    ...(height && { height }),
    ...(maxHeight && { maxHeight }),
    ...boxSx,
  };

  const renderNestedModal = () => {
    if (!nestedModal) return null;

    return (
      <AscendModal
        config={nestedModal}
        open={nestedModalOpen || false}
        onClose={onNestedModalClose || (() => {})}
        onOpen={onNestedModalOpen}
      />
    );
  };

  const handleTriggerClick = useCallback(() => {
    onOpenProp?.();
    config.onOpen?.();
  }, [onOpenProp, config]);

  // Clone trigger to add onClick handler if it's a React element
  const renderTrigger = () => {
    if (!trigger) return null;
    
    if (isValidElement(trigger)) {
      return cloneElement(trigger as React.ReactElement<any>, {
        onClick: handleTriggerClick,
      });
    }
    
    return (
      <div onClick={handleTriggerClick} style={{ display: 'inline-block', cursor: 'pointer' }}>
        {trigger}
      </div>
    );
  };

  return (
    <>
      {renderTrigger()}
      
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby={ariaLabelledBy || (title ? `${title}-modal-title` : undefined)}
        aria-describedby={ariaDescribedBy || (description ? `${description}-modal-description` : undefined)}
        {...modalProps}
        sx={sx}
      >
        <Box sx={modalStyle}>
          {title && (
            <h2 
              id={ariaLabelledBy || `${title}-modal-title`}
              style={{ marginTop: 0, marginBottom: description || content || children ? '16px' : 0 }}
            >
              {title}
            </h2>
          )}
          
          {description && (
            <p 
              id={ariaDescribedBy || `${description}-modal-description`}
              style={{ marginTop: 0, marginBottom: content || children ? '16px' : 0 }}
            >
              {description}
            </p>
          )}
          
          {content && <div style={{ marginBottom: actions || showCloseButton ? '16px' : 0 }}>{content}</div>}
          
          {children && <div style={{ marginBottom: actions || showCloseButton ? '16px' : 0 }}>{children}</div>}
          
          {nestedModal && renderNestedModal()}
          
          {actions && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              {actions}
            </div>
          )}
          
          {showCloseButton && !actions && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => onClose()} variant="contained">
                {closeButtonText}
              </Button>
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AscendModal;

