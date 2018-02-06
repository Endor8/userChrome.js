    (function() {

       if (location != 'chrome://browser/content/browser.xul')
          return;

       try {
          CustomizableUI.createWidget({
             id: 'print-toolbarbutton',
             type: 'custom',
             defaultArea: CustomizableUI.AREA_NAVBAR,
             onBuild: function(aDocument) {
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var attrs = {
                   id: 'print-toolbarbutton',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   type: 'menu',
                   removable: true,
                   label: 'Drucken',
                   tooltiptext: 'Drucken'
                };
                for (var a in attrs)
                   toolbaritem.setAttribute(a, attrs[a]);
                return toolbaritem;
             }
          });
       } catch(e) { };

       document.getElementById('home-button').parentNode.insertBefore(document.getElementById('print-toolbarbutton'), document.getElementById('home-button'));

       var css = '\
          #print-toolbarbutton {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAEEElEQVR42mL8//8/Az0AQACxkKJYSNmE30ZbMVRKRPgHsviBYxfv37hx/Cg+vQABxEiMjxRVLSyiIv3UXjx/aeLlYJTNyMjAhCx/9MyNHdz8Aktv3Lj979rlE2uuXLnyC90MgABiAFmED4tKaxvcunnr4r+/v/8Twr9//fxf19hdi80cgABiIuSb+OgITxUVRT18av7/+8fw4+t7hu+fXjDYWRvHYFMDEEAE40hUiFv5968fWOWAvmD4+e0jw++fXxkYmZgZmJlZGb59/SqGTS1AABG06Mv7l+xfPr2Fuvwvwz8g/v/vD8Pf3z+BQfIXaAELAxPQEmC8AcX/M3z68IYZmzkAAYTTIgkZfSemf/8/utjpC12+coNh9bpdDJKSIgxsLIwMoPQDNBNK/2eApacvX74x8HKxM0tJ6Rn/Y2SUfvH04iaYeQABhDUBGBo66p89d+HCf6ATYXjC7NX/zz/4gBd39c+Eq3/77t2X5LTieJiZAAGE1UeOzrbBuloq+r9/foOLPX7zmeHCvZd4g/n79x8MMD28XGzcVub6EUDmQhAfIICwWiQrJazwBxjByODhy/cMfwlYxP3rJwOyPk52ZmUYGyCAMCxKD3Pl1zJ3l/6D5BsQ0FVXYDDXEWPg4+ZgEOTjxLDk6Yu3DL/E1RmQ9TH//8PfVxwpW9S7/DFAAGFYJC7Eq/X3+0dFdB/l+qgDyT+gKIdiNH1SQEJKGcVHv39/F2RkYrAFMpcBBBBGhhXkYVUD5htRQiUGMRhoOCuQ1g8LC+MECCAUHzk6OrL4GYvJMjMycoD4127cZpizYBnJJbWHmyODm5MdjCuvJ84gARBAKBZpSnHzArOEBNA9YPFnz18wLF+9EZINGP5DswM8X2AXB4WKoADYImYWFlB+k+RmZZADCCAUi768+f2LUYrxyL2Hz92XLF4h8uDRE1YleWluGQkxhoT4BLih2As8Boa7t28xLFm9luHR/Qc/gfq/3334kkGM7e9WZtb/jwECCMWiRTt3fgWG5zoVWRF+FWWFGdKSwgy37txmsDMzYgiNiSUYZJdOHGY4fvokg562KruzvRn7hy1HNr69+3Fy36rV3wECCCPVrVq1CliXrJ6zbtmXiV9//mdXkpNmUFNSYPjz5xdBi1S0dRj0VBQY2Ng5GF5++MXAzs2zv2/Vqu8gOYAAwlHWhf4NimLg6G8sElJRlFSUlJLa8ff3LxFCFjGzsDIYaanOePLufZeTd8h9J2+EHEAA4S29C+v73gGpd8c2L2L+85uwj/79BZbuP7/+KWmefB9dDiCAiGozXDu2+cHVo1sEGQmo+8/A+JOB6e8lbHIAAUSURYw/GV2Y2f8J/GMGVkB4a9r/7ALsLA+wyQEEECO9mlsAAQYAq1BA/vIVsYsAAAAASUVORK5CYII=)}\
          #print-toolbarbutton > dropmarker {display: none}\
		  #print-toolbarbutton > image{min-height: 24px}\
		  #print-toolbarbutton > image{min-width: 26px}\
       ';

       var stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');

       document.insertBefore(stylesheet, document.documentElement);

       var xml, range;

       xml = '\
          <menupopup id="print-button-popup">\
             <menuitem label="Drucken…" tooltiptext="Drucken…" accesskey="D" command="cmd_print"/>\
             <menuitem label="Druckvorschau" tooltiptext="Druckvorschau" oncommand="PrintUtils.printPreview(PrintPreviewListener); event.stopPropagation();" accesskey="v"/>\
             <menuseparator/>\
             <menuitem label="Seite einrichten…" tooltiptext="Seite einrichten…" command="cmd_pageSetup" accesskey="e"/>\
          </menupopup>\
       ';

       range = document.createRange();
       range.selectNodeContents(document.getElementById('print-toolbarbutton'));
       range.collapse(false);
       range.insertNode(range.createContextualFragment(xml.replace(/\n|\t/g, '').replace(/ *</g, '<').replace(/> */g, '>')));
       range.detach();

       xml = '\
          <menu id="context-print-menu" label="Drucken…" accesskey="D">\
             <menupopup>\
                <menuitem id="context-print-menu-print" label="Drucken…" accesskey="D" command="cmd_print"/>\
                <menuitem id="context-print-menu-preview" label="Druckvorschau" accesskey="v" oncommand="PrintUtils.printPreview(PrintPreviewListener);"/>\
                <menuseparator/>\
                <menuitem id="context-print-menu-printSetup" label="Seite einrichten…" command="cmd_pageSetup" accesskey="e"/>\
             </menupopup>\
          </menu>\
       ';

       range = document.createRange();
       range.selectNodeContents(document.getElementById('contentAreaContextMenu'));
       range.collapse(false);
       range.insertNode(range.createContextualFragment(xml.replace(/\n|\t/g, '').replace(/ *</g, '<').replace(/> */g, '>')));
       range.detach();

       document.getElementById('contentAreaContextMenu').insertBefore(document.getElementById('context-print-menu'), document.getElementById('context-sep-viewbgimage').nextSibling);   

    })();

