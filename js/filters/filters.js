app.filter('reverse', Reverse);
app.filter('rawHtml', RawHtml);

function Reverse() {
    return function(items) {
        return items.slice().reverse();
    };
}

RawHtml.$inject = ['$sce'];
function RawHtml($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}