"use client";

import React from "react";
import { Modal as HeroModal, ModalBackdrop as HeroModalBackdrop, ModalBody as HeroModalBody, ModalCloseTrigger as HeroModalCloseTrigger, ModalContainer as HeroModalContainer, ModalDialog as HeroModalDialog, ModalFooter as HeroModalFooter, ModalHeader as HeroModalHeader, ModalHeading as HeroModalHeading, ModalIcon as HeroModalIcon, ModalRoot as HeroModalRoot, ModalTrigger as HeroModalTrigger } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Skeleton } from "./Skeleton";

export type ModalProps = React.ComponentProps<typeof HeroModal> & {
  className?: string;
  isSkeleton?: boolean;
  tooltip?: string;
};

const ModalBase: React.FC<ModalProps> = (
  ({ className = "", isSkeleton, tooltip, children, ...props }) => {
    if (isSkeleton) {
      return <Skeleton className={`klx-modal-skeleton ${className}`} />;
    }

    // A11y (L0.4): Modal e ModalRoot di HeroUI montano entrambi un DialogTrigger react-aria,
    // che senza figlio pressable emette "A PressResponder was rendered without a pressable
    // child" a ogni mount. Nell'uso controllato (isOpen definito, nessun Modal.Trigger — tutti
    // i dialoghi del framework) si soddisfa il PressResponder con un trigger inerte:
    // sr-only lo nasconde visivamente restando focusabile (requisito di Pressable),
    // tabIndex=-1 lo toglie dal tab order e aria-hidden dall'albero di accessibilità.
    const content = props.isOpen !== undefined ? (
      <HeroModalRoot {...props}>
        <HeroModalTrigger aria-hidden tabIndex={-1} className="sr-only" />
        {children}
      </HeroModalRoot>
    ) : (
      <HeroModal
        {...props}
      >
        {children}
      </HeroModal>
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{content}</Tooltip>
    }

    return content;
  }
);

ModalBase.displayName = "Modal";

export const ModalBackdrop = HeroModalBackdrop;
export const ModalBody = HeroModalBody;
export const ModalCloseTrigger = HeroModalCloseTrigger;
export const ModalContainer = HeroModalContainer;
export const ModalDialog = HeroModalDialog;
export const ModalFooter = HeroModalFooter;
export const ModalHeader = HeroModalHeader;
export const ModalHeading = HeroModalHeading;
export const ModalIcon = HeroModalIcon;
export const ModalRoot = HeroModalRoot;
export const ModalTrigger = HeroModalTrigger;

// Supporto per la sintassi a punti (Compound Components)
export const Modal = Object.assign(ModalBase, {
  Backdrop: ModalBackdrop,
  Body: ModalBody,
  CloseTrigger: ModalCloseTrigger,
  Container: ModalContainer,
  Dialog: ModalDialog,
  Footer: ModalFooter,
  Header: ModalHeader,
  Heading: ModalHeading,
  Icon: ModalIcon,
  Root: ModalRoot,
  Trigger: ModalTrigger
});
