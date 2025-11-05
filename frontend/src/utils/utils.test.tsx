import { describe, it, expect } from 'vitest';
import { formatTabPath } from './utils';

describe('Utils', () => {
  it('should create a slug from the tab name', () => {
    const tabs = ["Pour vous", "Mes recettes", "Mes informations"]

    expect(formatTabPath(tabs[0])).toBe('/pour-vous')
    expect(formatTabPath(tabs[1])).toBe('/mes-recettes')
    expect(formatTabPath(tabs[2])).toBe('/mes-informations')
  })
})