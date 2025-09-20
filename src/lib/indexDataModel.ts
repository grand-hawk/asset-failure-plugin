import { ContentProvider } from '@rbxts/services';

import type Iris from '@rbxts/iris';

export function toContentId(assetId: string | number) {
  if (typeIs(assetId, 'string') && string.match(assetId, '^rbxassetid://')[0])
    return assetId;
  return `rbxassetid://${assetId}`;
}

export default function indexDataModel(
  output: Iris.State<Instance[]>,
  count: Iris.State<number>,
  ignoreZero: boolean,
  finish: () => void,
) {
  const hasAssetPermission = (contentId: string) => {
    if (ignoreZero && contentId === 'rbxassetid://0') return true;

    const status = ContentProvider.GetAssetFetchStatus(contentId);
    if (status === Enum.AssetFetchStatus.Failure) return false;
    return true;
  };

  return task.spawn(() => {
    let counter = 0;
    for (const descendant of game.GetDescendants()) {
      counter += 1;
      if (counter % 100 === 0) {
        count.set(counter);
        task.wait();
      }

      let noPermission = false;

      // Instances that use `ContentId` as the type in the documentation/reference
      if (descendant.IsA('AdGui'))
        noPermission = !hasAssetPermission(descendant.FallbackImage);
      else if (descendant.IsA('Animation'))
        noPermission = !hasAssetPermission(descendant.AnimationId);
      else if (descendant.IsA('AssetPatchSettings'))
        noPermission = !hasAssetPermission(descendant.ContentId);
      else if (descendant.IsA('BackpackItem'))
        noPermission = !hasAssetPermission(descendant.TextureId);
      else if (descendant.IsA('Beam'))
        noPermission = !hasAssetPermission(descendant.Texture);
      else if (descendant.IsA('ClickDetector'))
        noPermission = !hasAssetPermission(descendant.CursorIcon);
      else if (descendant.IsA('Decal'))
        noPermission = !hasAssetPermission(descendant.Texture);
      else if (descendant.IsA('DragDetector'))
        noPermission = !hasAssetPermission(descendant.CursorIcon);
      else if (descendant.IsA('FileMesh'))
        noPermission =
          !hasAssetPermission(descendant.MeshId) ||
          !hasAssetPermission(descendant.TextureId);
      else if (descendant.IsA('FloorWire'))
        noPermission = !hasAssetPermission(descendant.Texture);
      else if (descendant.IsA('ImageButton'))
        noPermission =
          !hasAssetPermission(descendant.HoverImage) ||
          !hasAssetPermission(descendant.Image) ||
          !hasAssetPermission(descendant.PressedImage);
      else if (descendant.IsA('ImageHandleAdornment'))
        noPermission = !hasAssetPermission(descendant.Image);
      else if (descendant.IsA('ImageLabel'))
        noPermission = !hasAssetPermission(descendant.Image);
      else if (descendant.IsA('MaterialVariant'))
        noPermission =
          !hasAssetPermission(descendant.ColorMap) ||
          !hasAssetPermission(descendant.MetalnessMap) ||
          !hasAssetPermission(descendant.NormalMap) ||
          !hasAssetPermission(descendant.RoughnessMap);
      else if (descendant.IsA('MeshPart'))
        noPermission =
          !hasAssetPermission(descendant.MeshId) ||
          !hasAssetPermission(descendant.TextureID);
      else if (descendant.IsA('Mouse'))
        noPermission = !hasAssetPermission(descendant.Icon);
      else if (descendant.IsA('Pants'))
        noPermission = !hasAssetPermission(descendant.PantsTemplate);
      else if (descendant.IsA('ParticleEmitter'))
        noPermission = !hasAssetPermission(descendant.Texture);
      else if (descendant.IsA('ScrollingFrame'))
        noPermission =
          !hasAssetPermission(descendant.BottomImage) ||
          !hasAssetPermission(descendant.MidImage) ||
          !hasAssetPermission(descendant.TopImage);
      else if (descendant.IsA('Shirt'))
        noPermission = !hasAssetPermission(descendant.ShirtTemplate);
      else if (descendant.IsA('ShirtGraphic'))
        noPermission = !hasAssetPermission(descendant.Graphic);
      else if (descendant.IsA('Sky'))
        noPermission =
          !hasAssetPermission(descendant.MoonTextureId) ||
          !hasAssetPermission(descendant.SkyboxBk) ||
          !hasAssetPermission(descendant.SkyboxDn) ||
          !hasAssetPermission(descendant.SkyboxFt) ||
          !hasAssetPermission(descendant.SkyboxLf) ||
          !hasAssetPermission(descendant.SkyboxRt) ||
          !hasAssetPermission(descendant.SkyboxUp) ||
          !hasAssetPermission(descendant.SunTextureId);
      else if (descendant.IsA('Sound'))
        noPermission = !hasAssetPermission(descendant.SoundId);
      else if (descendant.IsA('SurfaceAppearance'))
        noPermission =
          !hasAssetPermission(descendant.ColorMap) ||
          !hasAssetPermission(descendant.MetalnessMap) ||
          !hasAssetPermission(descendant.NormalMap) ||
          !hasAssetPermission(descendant.RoughnessMap);
      // <SurfaceAppearance>.TexturePack is locked to engine
      else if (descendant.IsA('TerrainDetail'))
        noPermission =
          !hasAssetPermission(descendant.ColorMap) ||
          !hasAssetPermission(descendant.MetalnessMap) ||
          !hasAssetPermission(descendant.NormalMap) ||
          !hasAssetPermission(descendant.RoughnessMap);
      else if (descendant.IsA('Trail'))
        noPermission = !hasAssetPermission(descendant.Texture);
      else if (descendant.IsA('UIDragDetector'))
        noPermission =
          !hasAssetPermission(descendant.ActivatedCursorIcon) ||
          !hasAssetPermission(descendant.CursorIcon);
      else if (descendant.IsA('UserInputService'))
        noPermission = !hasAssetPermission(descendant.MouseIcon);
      else if (descendant.IsA('VideoFrame'))
        noPermission = !hasAssetPermission(descendant.Video);
      else if (descendant.IsA('VideoPlayer'))
        noPermission =
          !hasAssetPermission(descendant.Asset) ||
          !hasAssetPermission(descendant.Thumbnail);
      else if (descendant.IsA('WrapLayer'))
        noPermission = !hasAssetPermission(descendant.ReferenceMeshId);

      // Instances that use `AssetId` as the name in the documentation/reference
      if (!noPermission) {
        if (descendant.IsA('AccessoryDescription'))
          noPermission = !hasAssetPermission(toContentId(descendant.AssetId));
        else if (descendant.IsA('AudioPlayer'))
          noPermission = !hasAssetPermission(toContentId(descendant.AssetId));
        else if (descendant.IsA('BodyPartDescription'))
          noPermission = !hasAssetPermission(toContentId(descendant.AssetId));
      }

      // Instances that use `int64` as the type in the documentation/reference
      if (!noPermission) {
        if (descendant.IsA('CharacterMesh'))
          noPermission =
            !hasAssetPermission(toContentId(descendant.BaseTextureId)) ||
            !hasAssetPermission(toContentId(descendant.MeshId)) ||
            !hasAssetPermission(toContentId(descendant.OverlayTextureId));
        else if (descendant.IsA('HumanoidDescription'))
          noPermission =
            !hasAssetPermission(toContentId(descendant.ClimbAnimation)) ||
            !hasAssetPermission(toContentId(descendant.Face)) ||
            !hasAssetPermission(toContentId(descendant.FallAnimation)) ||
            !hasAssetPermission(toContentId(descendant.GraphicTShirt)) ||
            !hasAssetPermission(toContentId(descendant.Head)) ||
            !hasAssetPermission(toContentId(descendant.IdleAnimation)) ||
            !hasAssetPermission(toContentId(descendant.JumpAnimation)) ||
            !hasAssetPermission(toContentId(descendant.LeftArm)) ||
            !hasAssetPermission(toContentId(descendant.LeftLeg)) ||
            !hasAssetPermission(toContentId(descendant.MoodAnimation)) ||
            !hasAssetPermission(toContentId(descendant.Pants)) ||
            !hasAssetPermission(toContentId(descendant.RightArm)) ||
            !hasAssetPermission(toContentId(descendant.RightLeg)) ||
            !hasAssetPermission(toContentId(descendant.RunAnimation)) ||
            !hasAssetPermission(toContentId(descendant.Shirt)) ||
            !hasAssetPermission(toContentId(descendant.SwimAnimation)) ||
            !hasAssetPermission(toContentId(descendant.Torso)) ||
            !hasAssetPermission(toContentId(descendant.WalkAnimation));
      }

      if (noPermission) {
        const newOutput = output.get();
        newOutput.push(descendant);
        output.set(newOutput);
      }
    }

    finish();
  });
}
