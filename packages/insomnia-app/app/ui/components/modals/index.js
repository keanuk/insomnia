// @flow
import PromptModal from './prompt-modal';
import AlertModal from './alert-modal';
import ErrorModal from './error-modal';
import { trackEvent } from '../../../common/analytics';
import type { ErrorModalOptions } from './error-modal';

const modals = {};

export function registerModal(instance) {
  if (instance === null) {
    // Modal was unmounted
    return;
  }
  modals[instance.constructor.name] = instance;
}

export function showPrompt(config) {
  return showModal(PromptModal, config);
}

export function showAlert(config) {
  return showModal(AlertModal, config);
}

export function showError(config: ErrorModalOptions) {
  try {
    return showModal(ErrorModal, config);
  } catch (err) {
    console.log('[modal] Cannot show modal', err, config);
  }
}

export function showModal(modalCls, ...args) {
  trackEvent('Modals', 'Show', modalCls.name);
  return _getModal(modalCls).show(...args);
}

export function hideAllModals() {
  for (const key of Object.keys(modals)) {
    const modal = modals[key];
    modal.hide && modal.hide();
  }
}

function _getModal(modalCls) {
  const m = modals[modalCls.name || modalCls.WrappedComponent?.name];
  if (!m) {
    throw new Error('Modal was not registered with the app');
  }

  return m;
}
