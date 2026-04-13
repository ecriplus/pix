import { setOwner } from '@ember/owner';
import { getContext } from '@ember/test-helpers';
import GlimmerComponent from '@glimmer/component';

const OriginalBaseClass = Object.getPrototypeOf(GlimmerComponent);
const OriginalBaseProto = Object.getPrototypeOf(GlimmerComponent.prototype);

let pendingOwner, pendingArgs;

class SafeBase {
  constructor(owner, args) {
    setOwner(this, owner ?? pendingOwner);
    this.args = args ?? pendingArgs;
  }
}
Object.setPrototypeOf(SafeBase.prototype, OriginalBaseProto);

export default function createComponent(lookupPath, named = {}) {
  const { owner } = getContext();
  const { class: componentClass } = owner.factoryFor(lookupPath);

  pendingOwner = owner;
  pendingArgs = named;
  Object.setPrototypeOf(GlimmerComponent, SafeBase);
  Object.setPrototypeOf(GlimmerComponent.prototype, SafeBase.prototype);

  try {
    return new componentClass(owner, named);
  } finally {
    Object.setPrototypeOf(GlimmerComponent, OriginalBaseClass);
    Object.setPrototypeOf(GlimmerComponent.prototype, OriginalBaseProto);
    pendingOwner = null;
    pendingArgs = null;
  }
}
