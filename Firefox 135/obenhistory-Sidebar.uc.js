(function() {
/** Button Start **/
try {
	CustomizableUI.createWidget({
		id: "ch-sidebar",
		defaultArea: CustomizableUI.AREA_NAVBAR,
		class: 'chromeclass-toolbar-additional',
		removable: true,
		label: "Chronik öffnen",
		tooltiptext: "Chronik in Seitenleiste öffnen/schließen",
		onClick: function() {
			SidebarController.toggle("viewHistorySidebar");
		},
		onCreated: function(aNode) {
			aNode.style.listStyleImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAADtElEQVR42mL8//8/AyUAIIBYQMSMIx8Z/jD+Z/j69xfDp1+/JH/9/Wv56/dvefbf38S4GH/zszAzfPrDwHj892+RPcyX5L7+/wPUxMjA0NzMwAAQQCwoxjEymLEys2T+//5ZWZn9u4qWLI8YLxsXMytQ8Z///74/efPi6BO5r7X/v/OcYGJhAmqQZgAIILgBjIwMOiysrB2sX1/LWon9lTNVk2fjYGVj+PUHaB0jEwMPFxenhsJvl3sid7SfP7kQzczKuh9kAEAAgYxh+PrrExMzO0s1y/+/ugb8v6TtdeTYWFnYGH7++QvUy8zAysrK8P3nT4Zv338wqKlqS4qKyc3+8YNBEqQXIIAgBvz+Zfrl9w8P1m/v2I0VRTkZmFkZQEHLwsLCwM7ODnQdI8P+/fsZHj9+DBRjZlBQVFQG+ioapBcggKAu+GH19v17AV7mPxwiQvxAzYxgW9mA+MevXwybduxg+P79O4OmpibYu3x8vCDsDGIDBBA4DN5/eCvIxs7L8JPhH/OXbz8YeHl4GN68ecNw5ORJhh/37jHwAd3rVFrKwAZ00e/fvxk+fPzMwMTEIg/SCxBAYBco6Gn8+fjxA8PrD58ZBPh5GZiBCnn4+Bh0dHQYrJ2dGXy5uRm4z5xh+AdU+/ffPwYOdjagK/9/AukFCCCIFz58efYfmA7O3rjHePTmc4ZJB+8C0wUrg7qyMtBwPYY/8fEMfw4fZvgBDIcfwFjh5ORgOHP69EWQXoAAAhsgJiF6kIOD9dmzH/8Z01dcYFh9/gnDx0+fGb5//cLw8eNHhk9AF30IDGT4BIwJNiYmhufPn/9etGjRGpBegAACG3D/5YfbHCKiRzgU1Bk+MbAC/fmX4ePX7wzfgAZ8+vSJ4TMwPL5ycjJwOTgw/Ae6YOqUKdNPnzmzF6QXIIDAgfjm/YfEn7/+BzJx8TAI8jEwfPj8meH+k2d/pTRkmbm4uBiYmSFp4cnDh196+ybMm79wfhNQGyhIGAACCGwAFyfLlX+MXzL/PbhnwvSDzewPl5RseX3LbFtFERE9YxNdJiamf1evXru2Z/fOnc9u3dzFxcDw2RGaggECiBGUGxM3nWW4unsVw7MNkxg0lYR5eGRMDF5fOvD03qOv//4ysgsC1f3nZPj6UYqH4Z2mKMPvXy8Z/qi9YPhT++//f4AAArvg2qYVDKfn9jAoyDIwKDI+/fL07NMjbO8YmDz0GFm+8n59DjKA9zsD4+MbDP+f/GJg0BJh+PfvFcQFAAEGAErkYEjf136gAAAAAElFTkSuQmCC)';
	    aNode.setAttribute('accesskey' , 'h');
            return aNode;
        }
	});
} catch (e) {
	Components.utils.reportError(e);
};
/** Button Ende **/
})();
