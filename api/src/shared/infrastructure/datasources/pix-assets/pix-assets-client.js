/**
 * @param{URL} assetUrl
 */
export async function fetchAssetsMetadata(assetUrl) {
  const assetResponse = await fetch(assetUrl, { method: 'OPTIONS' });
  if (!assetResponse.ok) {
    throw new Error(`Failed to fetch asset ${assetUrl}: ${assetResponse.status} ${assetResponse.statusText}`);
  }

  return assetResponse.json();
}
