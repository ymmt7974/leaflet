
L.Path.include({
  getZIndex: function() {
      var node = this._path;
      var index = 0;
      while ( (node = node.previousElementSibling) ) {
          index++;
      }
      return index;
  },
  setZIndex: function(idx) {
      var obj1 = this._path;
      var parent = obj1.parentNode;
      if(parent.childNodes.length < idx){
          idx = parent.childNodes.length-1;
      }
      var obj2 = parent.childNodes[idx];
      if(obj2 === undefined || obj2 === null){
          return;
      }
      var next2 = obj2.nextSibling;
      if (next2 === obj1) {
          parent.insertBefore(obj1, obj2);
      } else {
          parent.insertBefore(obj2, obj1);
          if (next2) {
              parent.insertBefore(obj1, next2);
          } else {
              parent.appendChild(obj1);
          }
      }
  },
  setZIndexOneUp: function(){
      this.setZIndex(this.getZIndex()+1)
  },
  setZIndexOneDown: function(){
      this.setZIndex(this.getZIndex()-1)
  }
});

L.drawLocal = {
  draw: {
    toolbar: {
      actions: {
        title: '描画をキャンセル',
        text: 'キャンセル'
      },
      finish: {
        title: '描画を終了',
        text: '終了',
      },
      undo: {
        title: '最後に描いた点を削除',
        text: '最後の点を削除',
      },
      buttons: {
        polyline: 'ポリラインを描く',
        polygon: '多角形を描く',
        rectangle: '四角形を描く',
        circle: '円を描く',
        marker: 'マーカーを描画',
        circlemarker: 'サークルマーカーを描画'
      }
    },
    handlers: {
      circle: {
        tooltip: {
          start: 'クリック＆ドラッグで円を描く。'
        },
        radius: '半径'
      },
      circlemarker: {
        tooltip: {
          start: 'マップをクリックしてサークルマーカーを配置します。'
        }
      },
      marker: {
        tooltip: {
          start: 'マップをクリックしてマーカーを配置してください'
        }
      },
      polygon: {
        tooltip: {
          start: 'クリックして図形の描画を開始します',
          cont: 'クリックして図形の描画を続けます',
          end: '最初のポイントをクリックしてこの図形を閉じます。'
        }
      },
      polyline: {
        error: '<strong>Error:</strong> shape edges cannot cross!',
        tooltip: {
          start: 'クリックして線の描画を開始します',
          cont: 'クリックして線の描画を続けます',
          end: '最後のポイントをクリックして線を終了します。'
        }
      },
      rectangle: {
        tooltip: {
          start: 'クリックしてドラッグすると長方形が描かれます'
        }
      },
      simpleshape: {
        tooltip: {
          end: 'マウスを離して描画を終了します'
        }
      }
    }
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: '変更を保存',
          text: '保存'
        },
        cancel: {
          title: '編集をキャンセルし、すべての変更を破棄します',
          text: 'キャンセル'
        },
        clearAll: {
          title: 'すべてのレイヤーを消去',
          text: 'すべて消去'
        }
      },
      buttons: {
        edit: 'レイヤーの編集',
        editDisabled: '編集するレイヤーがありません',
        remove: 'レイヤーを削除',
        removeDisabled: '削除するレイヤーがありません'
      }
    },
    handlers: {
      edit: {
        tooltip: {
          text: 'ハンドルやマーカーをドラッグして、機能を編集します',
          subtext: '変更を元に戻すにはキャンセルをクリックしてください。'
        }
      },
      remove: {
        tooltip: {
          text: '削除する機能をクリックしてください。'
        }
      }
    }
  }
};

// ======================================================================
// functions 
// ======================================================================
// -----------------------------------
// menucontext
// -----------------------------------
// 編集_開始
function editStart(drawControl, layer) {
  return function(e) {
    // drawControl._toolbars.edit._modes.edit.handler.enable();
    drawControl._toolbars.edit._modes.edit.handler._uneditedLayerProps = {};
    drawControl._toolbars.edit._modes.edit.handler._backupLayer(layer);
    layer.editing.enable();
  }
}
// 編集_キャンセル
function editCancel(drawControl, layer) {
  return function(e) {
    drawControl._toolbars.edit._modes.edit.handler._revertLayer(layer)
    layer.editing.disable();
  }
}
// 編集_終了
function editSave(drawControl, layer) {
  return function(e) {
    drawControl._toolbars.edit._modes.edit.handler.save();
    layer.editing.disable();
  }
}
// -----------------------------------
// 前面
function bringToFront(layer) {
  return function(e) {
    if (!layer instanceof L.Marker) {
      layer.setZIndexOneUp();
    }
  }
}
// 背面
function bringToBack(layer) {
  return function(e) {
    if (!layer instanceof L.Marker) {
      layer.setZIndexOneDown();
    }
  }
}
// 最背面
function bringToFrontMost(layer) {
  return function(e) {
    if (!layer instanceof L.Marker) {
      layer.bringToFront();
    }
  }
}
// 最背面
function bringToBackMost(layer) {
  return function(e) {
    if (!layer instanceof L.Marker) {
      layer.bringToBack();
    }
  }
}
// -----------------------------------
