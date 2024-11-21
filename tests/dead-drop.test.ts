import { describe, it, beforeEach, expect } from 'vitest';
import { mockNet } from './mocks';

describe('dead-drop', () => {
  let client: any;
  let creator: string;
  let claimer: string;
  
  beforeEach(() => {
    client = mockNet.createClient();
    creator = mockNet.getCreator();
    claimer = mockNet.getClaimer();
  });
  
  it('creates a dead drop successfully', async () => {
    const content = 'Secret message';
    const accessKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const result = await client.createDeadDrop(creator, content, accessKey);
    expect(result.success).toBe(true);
    expect(typeof result.value).toBe('number');
  });
  
  it('claims a dead drop successfully', async () => {
    const content = 'Another secret message';
    const accessKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const createResult = await client.createDeadDrop(creator, content, accessKey);
    const dropId = createResult.value;
    
    const claimResult = await client.claimDeadDrop(claimer, dropId, accessKey);
    expect(claimResult.success).toBe(true);
    expect(claimResult.value).toBe(content);
  });
  
  it('fails to claim with incorrect access key', async () => {
    const content = 'Secret data';
    const accessKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const createResult = await client.createDeadDrop(creator, content, accessKey);
    const dropId = createResult.value;
    
    const wrongKey = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    const claimResult = await client.claimDeadDrop(claimer, dropId, wrongKey);
    expect(claimResult.success).toBe(false);
    expect(claimResult.error).toBe(103); // err-unauthorized
  });
  
  it('fails to claim an already claimed drop', async () => {
    const content = 'One-time secret';
    const accessKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const createResult = await client.createDeadDrop(creator, content, accessKey);
    const dropId = createResult.value;
    
    await client.claimDeadDrop(claimer, dropId, accessKey);
    const secondClaimResult = await client.claimDeadDrop(claimer, dropId, accessKey);
    expect(secondClaimResult.success).toBe(false);
    expect(secondClaimResult.error).toBe(102); // err-already-claimed
  });
  
  it('gets drop info successfully', async () => {
    const content = 'Info test message';
    const accessKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const createResult = await client.createDeadDrop(creator, content, accessKey);
    const dropId = createResult.value;
    
    const infoResult = await client.getDropInfo(dropId);
    expect(infoResult.success).toBe(true);
    expect(infoResult.value.creator).toBe(creator);
    expect(infoResult.value.claimed).toBe(false);
  });
  
  it('gets total number of drops', async () => {
    const initialTotal = await client.getTotalDrops();
    
    await client.createDeadDrop(creator, 'Message 1', '0x1111111111111111111111111111111111111111111111111111111111111111');
    await client.createDeadDrop(creator, 'Message 2', '0x2222222222222222222222222222222222222222222222222222222222222222');
    
    const newTotal = await client.getTotalDrops();
    expect(newTotal.value).toBe(initialTotal.value + 2);
  });
});

