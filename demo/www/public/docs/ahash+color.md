# aHash + Color Histogram Image Verification System - Developer Implementation Guide

## Overview

The image verification system has migrated from **pHash** (perceptual hash) to a **dual-factor approach** combining **aHash (average hash)** with **color histogram analysis**. This provides more robust and accurate image matching for NFT PFP verification. The system now includes a **two-tier matching architecture** for efficient multi-collection verification.

## Two-Tier Matching System

### Architecture Overview

The system implements a two-tier matching approach for efficient verification across multiple NFT collections:

1. **Tier 1 (Collection-Level Pre-filtering)**: Compares the PFP's aHash against collection signatures to rank the top 3 most promising collections
2. **Tier 2 (Token-Level Matching)**: Searches only the top 3 collections for the actual token match

### Collection Signatures

- Each collection has a "collection signature" stored in its config file as `nftAvgHashValue`
- Currently uses token #100's aHash as the collection signature for both BAYC and LOSER
- Enables quick collection-level comparison before detailed token matching

### Implementation

```typescript
// Tier 1: Collection-level filtering
const collectionRankings = []
for (const config of configs) {
  const similarity = compareAHash(pfpAHash, config.nftAvgHashValue)
  collectionRankings.push({
    poolName: config.poolName,
    similarity: similarity,
    config: config
  })
}

// Sort collections by similarity (highest first)
collectionRankings.sort((a, b) => b.similarity - a.similarity)
const top3Collections = collectionRankings.slice(0, 3)

// Tier 2: Token-level matching within top collections
for (const collection of top3Collections) {
  const database = JSON.parse(await fsPromises.readFile(databasePath, 'utf8'))
  for (const [tokenId, features] of Object.entries(database.data)) {
    const similarity = compareAHash(pfpAHash, features.aHash)
    // Find best match across all top collections
  }
}
```

## Technical Implementation

### aHash (Average Hash)

- **Process**: Images are converted to grayscale, resized to 64x64 pixels, then compared against the average pixel intensity
- **Output**: 4096-bit binary string (64x64 = 4096 pixels, each pixel becomes 1 or 0)
- **Strength**: Highly resistant to compression, scaling, and minor modifications
- **Weight**: 70% of total similarity score

### Color Histogram

- **Process**: RGB channels are analyzed using 16-bin histograms for each color channel
- **Output**: Three 16-element arrays (R, G, B) representing color distribution
- **Strength**: Captures overall color composition and tone
- **Weight**: 30% of total similarity score

## Configuration Parameters (64x64x16 Standard)

```javascript
const processingParams = {
  aHash: {
    resolution: { width: 64, height: 64 },
    preprocessing: { grayscale: true, resizeFit: 'fill' }
  },
  colorHistogram: {
    bins: 16,
    binDivisor: 16 // 256 colors ÷ 16 = 16 bins per channel
  },
  imagePreprocessing: {
    resize: { width: 64, height: 64 },
    format: 'png'
  }
}

// Similarity Calculation
const totalSimilarity = aHashSimilarity * 0.7 + colorSimilarity * 0.3
```

## Required Code Implementation

### 1. Core Interface Definitions

```typescript
interface ProcessingParams {
  aHash: {
    resolution: { width: number; height: number }
    preprocessing: { grayscale: boolean; resizeFit: string }
  }
  colorHistogram: {
    bins: number
    binDivisor: number
  }
  imagePreprocessing: {
    resize: { width: number; height: number }
    format: string
  }
}

interface ColorHistogram {
  r: number[]
  g: number[]
  b: number[]
}

interface ImageFeatures {
  aHash: string
  colorHist: ColorHistogram
  url: string
}

interface DatabaseFormat {
  metadata: {
    version: string
    created: string
    description: string
    processingParams: ProcessingParams
    specialTokens?: number[] // Array of token IDs requiring manual verification
  }
  data: Record<string, ImageFeatures>
}
```

### 2. aHash Calculation Function

```javascript
async function calculateAHash(buffer, params) {
  const image = await sharp(buffer)
    .grayscale()
    .resize(params.aHash.resolution.width, params.aHash.resolution.height, {
      fit: params.aHash.preprocessing.resizeFit
    })
    .raw()
    .toBuffer()

  const pixels = Array.from(image)
  const mean = pixels.reduce((sum, val) => sum + val, 0) / pixels.length
  return pixels.map(p => (p > mean ? '1' : '0')).join('')
}
```

### 3. Color Histogram Calculation Function

```javascript
async function calculateColorHistogram(buffer, params) {
  const image = await sharp(buffer)
    .resize(
      params.imagePreprocessing.resize.width,
      params.imagePreprocessing.resize.height
    )
    .raw()
    .toBuffer()

  const pixels = Array.from(image)
  const histogram = {
    r: new Array(params.colorHistogram.bins).fill(0),
    g: new Array(params.colorHistogram.bins).fill(0),
    b: new Array(params.colorHistogram.bins).fill(0)
  }

  for (let i = 0; i < pixels.length; i += 3) {
    const r = Math.floor(pixels[i] / params.colorHistogram.binDivisor)
    const g = Math.floor(pixels[i + 1] / params.colorHistogram.binDivisor)
    const b = Math.floor(pixels[i + 2] / params.colorHistogram.binDivisor)
    histogram.r[r]++
    histogram.g[g]++
    histogram.b[b]++
  }

  return histogram
}
```

### 4. Comparison Functions

```javascript
// aHash Comparison
function compareAHash(hash1, hash2) {
  let matches = 0
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] === hash2[i]) matches++
  }
  return matches / hash1.length
}

// Color Histogram Comparison
function compareColorHist(hist1, hist2) {
  const channels = ['r', 'g', 'b']
  let totalSimilarity = 0

  for (const channel of channels) {
    const sum1 = hist1[channel].reduce((a, b) => a + b, 0)
    const sum2 = hist2[channel].reduce((a, b) => a + b, 0)

    let channelSimilarity = 0
    const maxSum = Math.max(sum1, sum2)

    if (maxSum > 0) {
      for (let i = 0; i < hist1[channel].length; i++) {
        const norm1 = hist1[channel][i] / sum1
        const norm2 = hist2[channel][i] / sum2
        channelSimilarity += Math.min(norm1, norm2)
      }
    }

    totalSimilarity += channelSimilarity
  }

  return totalSimilarity / 3 // Average across RGB channels
}
```

### 5. Two-Tier Matching Implementation

```javascript
export async function POST(request) {
  // ... existing setup code ...

  // Generate aHash for the PFP
  const pfpAHash = await calculateAHash(buffer, processingParams)

  // TIER 1: Collection-level filtering
  const collectionRankings = []
  for (const config of configs) {
    const similarity = compareAHash(pfpAHash, config.nftAvgHashValue)
    collectionRankings.push({
      poolName: config.poolName,
      similarity: similarity,
      config: config
    })
  }

  // Sort collections by similarity (highest first)
  collectionRankings.sort((a, b) => b.similarity - a.similarity)
  const top3Collections = collectionRankings.slice(0, 3)

  // TIER 2: Token-level matching within top collections
  let globalBestMatch = {
    poolName: '',
    tokenId: '',
    similarity: 0,
    isSpecial: false
  }

  for (const collection of top3Collections) {
    const database = JSON.parse(await fsPromises.readFile(databasePath, 'utf8'))
    const specialTokens = database.metadata.specialTokens || []

    for (const [tokenId, features] of Object.entries(database.data)) {
      const similarity = compareAHash(pfpAHash, features.aHash)

      if (similarity > globalBestMatch.similarity) {
        globalBestMatch = {
          poolName: collection.poolName,
          tokenId,
          similarity,
          isSpecial: specialTokens.includes(Number(tokenId)) || false
        }
      }
    }
  }

  // Return enhanced response with collection rankings and top matches
  return NextResponse.json({
    poolName: globalBestMatch.poolName,
    tokenId: globalBestMatch.tokenId,
    similarity: globalBestMatch.similarity,
    isSpecial: globalBestMatch.isSpecial,
    topMatches: top5Matches,
    collectionRankings: top3Collections.map(c => ({
      poolName: c.poolName,
      similarity: (c.similarity * 100).toFixed(2) + '%'
    }))
  })
}
```

## Test Endpoints (All Updated with Two-Tier Matching)

### ✅ Updated Test Endpoints

All test endpoints now implement the two-tier matching system:

1. **`frontend/src/app/api/test-ahash-verify-nft-pfp/route.ts`**
   - **Purpose**: Test endpoint for PFP URL verification
   - **Features**: Two-tier matching, dynamic config loading, special token handling
   - **Response**: Best match, similarity, special flag, top 5 matches, collection rankings

2. **`frontend/src/app/api/test-direct-image/route.ts`**
   - **Purpose**: Test endpoint for direct image URL verification
   - **Features**: Two-tier matching, dynamic config loading, special token handling
   - **Response**: Best match, similarity, special flag, top 5 matches, collection rankings

3. **`frontend/src/app/api/test-upload-match/route.ts`**
   - **Purpose**: Test endpoint for file upload verification
   - **Features**: Two-tier matching, dynamic config loading, special token handling
   - **Response**: Best match, similarity, special flag, top 5 matches, collection rankings

4. **`frontend/src/app/api/test-local-image/route.ts`**
   - **Purpose**: Test endpoint for local image file verification
   - **Features**: Two-tier matching, dynamic config loading, special token handling
   - **Response**: Best match, similarity, special flag, top 5 matches, collection rankings

5. **`frontend/src/app/api/test-username-verify-nft-pfp/route.ts`**
   - **Purpose**: Test endpoint for Twitter username verification
   - **Features**: Two-tier matching, dynamic config loading, special token handling, ownership verification
   - **Response**: Best match, similarity, special flag, top 5 matches, collection rankings, owner info

### Frontend Test Pages

All frontend test pages have been updated to display two-tier matching results:

- **`frontend/src/app/test-direct-image/page.tsx`** - Direct image URL testing
- **`frontend/src/app/test-upload-image/page.tsx`** - File upload testing
- **`frontend/src/app/test-local-image/page.tsx`** - Local image file testing

### Testing URLs

- `http://localhost:3000/test-direct-image`
- `http://localhost:3000/test-upload-image`
- `http://localhost:3000/test-local-image`

## File Locations

### aHash Database Files

- **BAYC**: `C:\Users\Brian\PFP2E\frontend\src\data\BAYC_aHashes_64x64x16.json`
- **LOSER**: `C:\Users\Brian\PFP2E\frontend\src\data\LOSER1_aHashes_64x64x16.json`

### Configuration Files (Updated with Collection Signatures)

- **BAYC Config**: `C:\Users\Brian\PFP2E\frontend\public\BAYC_Config.json`
  - Contains `nftAvgHashValue` (token #100's aHash as collection signature)
- **LOSER Config**: `C:\Users\Brian\PFP2E\frontend\public\LOSER1_Config.json`
  - Contains `nftAvgHashValue` (token #100's aHash as collection signature)

### Documentation

- **Implementation Guide**: `C:\Users\Brian\PFP2E\scripts\ahash+color.md`

## Required File Updates for Production

### 🔴 CRITICAL - Main Production Endpoints (MUST UPDATE)

1. **`frontend/src/app/api/verify-nft-pfp/route.ts`**
   - Replace `import phash from 'sharp-phash'` with aHash implementation
   - Replace `pfpHash = await phash(buffer)` with new dual-factor system
   - Replace `hammingDistance(pfpHash, nft.hash)` with aHash + color comparison
   - Update database file path from `loser_hashes.json` to `LOSER1_aHashes_64x64x16.json`
   - **Add two-tier matching system**

2. **`frontend/src/app/api/save-user/route.ts`**
   - Replace phash generation with aHash + color histogram
   - Update database storage to save both aHash and colorHist

3. **`frontend/src/app/api/snapshot/route.ts`**
   - Replace phash calculation with new system
   - Update hash comparison logic

### 🟨 OPTIONAL - Cleanup Files

4. **`frontend/package.json`**
   - Remove `"sharp-phash": "^2.2.0"` dependency
   - Run `npm uninstall sharp-phash`

## Database Files

### Current aHash Database

- **File**: `frontend/src/data/BAYC_aHashes_64x64x16.json`
- **Format**: Contains metadata with processing parameters + token data with aHash and colorHist
- **Size**: ~50MB (includes 10,000 NFT entries)

### Legacy Database (TO BE DEPRECATED)

- **File**: `frontend/src/data/BAYC_hashes.json`
- **Contains**: Old pHash data
- **Status**: Keep as backup until production migration is complete

## Migration Checklist

### Phase 1: Update Production Endpoints

- [ ] Update `/verify-nft-pfp/route.ts` to use aHash + color system
- [ ] Update `/save-user/route.ts` to use new hashing
- [ ] Update `/snapshot/route.ts` to use new system
- [ ] **Add two-tier matching system to production endpoints**
- [ ] Test all endpoints thoroughly

### Phase 2: Database Migration

- [ ] Ensure all production code uses `BAYC_aHashes_64x64x16.json`
- [ ] Verify processing parameters are loaded from database metadata
- [ ] Update any hardcoded database paths

### Phase 3: Cleanup

- [ ] Remove sharp-phash dependency
- [ ] Remove old pHash imports
- [ ] Archive old hash database files

## Special Considerations

### Special Token IDs

The following tokens require manual verification (already implemented in test endpoints):

```javascript
const SPECIAL_TOKEN_IDS = []
```

### Special Tokens Handling

#### Overview

The aHash + color system includes dynamic special token handling to flag tokens that require manual verification due to high similarity with other tokens in the collection.

#### Database Structure

Special tokens are stored in the JSON database metadata:

```json
{
  "metadata": {
    "version": "1.0",
    "created": "2024-01-01",
    "description": "BAYC aHash database",
    "processingParams": {...},
    "specialTokens": [300, 324, 864, 880, 1237, 1688, 1748, 2217, 2234, 2390, 2425, 2426, 3131, 3665, 4070, 4252, 4283, 4584, 4624, 4731, 5520, 5553, 5898, 5923, 6166, 6224, 6394, 6539, 6578, 6621, 6801, 7061, 7065, 7137, 7330, 7350, 7664, 8184, 8271, 8416, 8873, 9091, 9110, 9253, 9791, 9810]
  },
  "data": {...}
}
```

#### Implementation in Endpoints

All verification endpoints now dynamically read special tokens from the database:

```typescript
// Load database and get special tokens
const database = JSON.parse(
  await fsPromises.readFile(databasePath, 'utf8')
) as DatabaseFormat
const specialTokens = database.metadata.specialTokens || []

// Check if matched token is special
const isSpecial = specialTokens.includes(Number(tokenId)) || false

// Include in response
return NextResponse.json({
  result: matchMessage,
  tokenId: bestMatch.tokenId,
  similarity: bestMatch.similarity,
  isSpecial: bestMatch.isSpecial, // Flag for manual verification
  topMatches
})
```

#### Benefits

1. **Dynamic**: No hardcoded arrays - special tokens are stored in the database
2. **Collection-specific**: Each collection can have its own special tokens list
3. **Maintainable**: Easy to update special tokens without code changes
4. **Scalable**: Works with any collection (LOSER, BAYC, future collections)

#### Current Special Token Counts

- **BAYC**: 46 tokens with 99.5%+ similarity matches
- **LOSER**: 50+ tokens requiring manual verification

### Performance Notes

- aHash + Color processing is slightly more intensive than pHash
- Database file is larger (~50MB vs ~4MB) but contains richer data
- Similarity calculations are more accurate but require both metrics
- **Two-tier matching significantly improves performance for multi-collection scenarios**

## Testing

- All test endpoints are fully functional with the new system
- Verify that similarity scores are reasonable (typically 85%+ for matches)
- Test two-tier matching with multiple collections

## Advantages Over pHash

1. **Dual-factor verification** reduces false positives/negatives
2. **Color awareness** catches cases where structure is similar but colors differ
3. **Configurable weighting** allows fine-tuning for specific collections
4. **Better compression resistance** with the 64x64 resolution
5. **Special token handling** for edge cases requiring manual verification
6. **Consistent processing** between dataset generation and verification
7. **Two-tier matching** for efficient multi-collection verification
8. **Dynamic config loading** for scalable collection management
