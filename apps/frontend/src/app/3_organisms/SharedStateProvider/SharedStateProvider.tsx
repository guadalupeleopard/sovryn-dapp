import React, { useCallback, useEffect, useState } from 'react';

import { useAccount } from '../../../hooks/useAccount';
import {
  sharedState,
  FastBtcDialogState,
  EmailNotificationSettingsDialogState,
} from '../../../store/rxjs/shared-state';
import { EmailNotificationSettingsDialog } from '../EmailNotificationSettingsDialog/EmailNotificationSettingsDialog';
import { FastBtcDialog } from '../FastBtcDialog/FastBtcDialog';

export const SharedStateProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { account } = useAccount();

  const [fastBtcDialog, setFastBtcDialog] = useState<FastBtcDialogState>(
    sharedState.get().fastBtcDialog,
  );

  const [emailNotificationSettingsDialog, setEmailNotificationSettingsDialog] =
    useState<EmailNotificationSettingsDialogState>(
      sharedState.get().emailNotificationSettingsDialog,
    );

  useEffect(() => {
    const fastBtcDialogSubscription = sharedState
      .select('fastBtcDialog')
      .subscribe(setFastBtcDialog);

    return () => {
      fastBtcDialogSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const emailNotificationSettingsDialogSubscription = sharedState
      .select('emailNotificationSettingsDialog')
      .subscribe(setEmailNotificationSettingsDialog);

    return () => {
      emailNotificationSettingsDialogSubscription.unsubscribe();
    };
  }, []);

  const handleFastBtcDialogClose = useCallback(
    () => sharedState.actions.closeFastBtcDialog(),
    [],
  );

  const handleEmailNotificationSettingsDialogClose = useCallback(
    () => sharedState.actions.closeEmailNotificationSettingsDialog(),
    [],
  );

  // Close the dialog if there is no wallet connected
  useEffect(() => {
    if (fastBtcDialog.isOpen && !account) {
      handleFastBtcDialogClose();
    }
  }, [account, fastBtcDialog.isOpen, handleFastBtcDialogClose]);

  return (
    <>
      {children}

      <FastBtcDialog
        isOpen={fastBtcDialog.isOpen}
        shouldHideSend={fastBtcDialog.shouldHideSend}
        onClose={handleFastBtcDialogClose}
      />

      <EmailNotificationSettingsDialog
        isOpen={emailNotificationSettingsDialog.isOpen}
        onClose={handleEmailNotificationSettingsDialogClose}
      />
    </>
  );
};
