class MockNet {
  private drops: Map<number, { creator: string, content: string, accessKey: string, claimed: boolean }> = new Map();
  private nextDropId: number = 0;

  createClient() {
    return {
      createDeadDrop: this.createDeadDrop.bind(this),
      claimDeadDrop: this.claimDeadDrop.bind(this),
      getDropInfo: this.getDropInfo.bind(this),
      getTotalDrops: this.getTotalDrops.bind(this),
    };
  }

  async createDeadDrop(creator: string, content: string, accessKey: string) {
    const dropId = this.nextDropId++;
    this.drops.set(dropId, { creator, content, accessKey, claimed: false });
    return { success: true, value: dropId };
  }

  async claimDeadDrop(claimer: string, dropId: number, providedKey: string) {
    const drop = this.drops.get(dropId);
    if (!drop) {
      return { success: false, error: 101 }; // err-not-found
    }
    if (drop.claimed) {
      return { success: false, error: 102 }; // err-already-claimed
    }
    if (drop.accessKey !== providedKey) {
      return { success: false, error: 103 }; // err-unauthorized
    }
    drop.claimed = true;
    return { success: true, value: drop.content };
  }

  async getDropInfo(dropId: number) {
    const drop = this.drops.get(dropId);
    if (!drop) {
      return { success: false, error: 101 }; // err-not-found
    }
    return { success: true, value: { creator: drop.creator, claimed: drop.claimed } };
  }

  async getTotalDrops() {
    return { success: true, value: this.nextDropId };
  }

  getCreator(): string {
    return 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  }

  getClaimer(): string {
    return 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
  }
}

export const mockNet = new MockNet();

