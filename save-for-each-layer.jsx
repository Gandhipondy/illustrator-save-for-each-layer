//実行
main();

function main() {

  if (!isIllustartor()) {
    alert("このスクリプトは Adobe Illustrator でのみ実行可能です。");
    return;
  }

  if (!hasDocuments()) {
    alert("ドキュメントが開かれていません。");
    return;
  }

  var folder = Folder.selectDialog("保存フォルダを選択してください。");
  if (!folder) {
    return;
  }

  changeLayersVisibility(null, false);

  for (var i = 0; i < app.activeDocument.layers.length; i++) {
    var layer = app.activeDocument.layers[i];
    saveLayer(layer, folder, layer.name);
  }

  changeLayersVisibility(null, true);

  alert("保存完了しました。");
}

//Adobe Illustratorを実行しているかどうかを判定
function isIllustartor() {
  return app.name == "Adobe Illustrator";
}

//文書を開いているかを判定
function hasDocuments() {
  return documents.length > 0;
}

function saveLayer(layer, folder, filename) {
  var opt = new ExportOptionsPNG24();
  opt.transparency = true;
  opt.antiAliasing = true;
  opt.artBoardClipping = false;
  opt.horizontalScale = 100.0;
  opt.verticalScale = 100.0;

  //対象レイヤ及びサブレイヤをすべて表示
  if (layer.layers.length > 0) {
    changeLayersVisibility(layer.layers, true);
  }
  layer.visible = true;

  //保存
  var filePath = folder + "/" + filename + ".png";
  var file = new File(filePath);
  app.activeDocument.exportFile(file, ExportType.PNG24, opt);

  //サブレイヤをすべて非表示
  if (layer.layers.length > 0) {
    changeLayersVisibility(layer.layers, false);
  }

  //サブレイヤをそれぞれ書き出し
  if (layer.layers.length > 0) {
    for (var i = 0; i < layer.layers.length; i++) {
      var childlayer = layer.layers[i];
      saveLayer(childlayer, folder, filename + "_" + childlayer.name);
    }
  }

  layer.visible = false;
}

//レイヤの表示状態を切り替える。サブレイヤも対象。
function changeLayersVisibility(layers, value) {
  if (layers == null) {
    layers = app.activeDocument.layers;
  }

  for (var i = 0; i < layers.length; i++) {
    if (layers[i].layers.length > 0) {
      changeLayersVisibility(layers[i].layers, value);
    }
    layers[i].visible = value;
  }
}
