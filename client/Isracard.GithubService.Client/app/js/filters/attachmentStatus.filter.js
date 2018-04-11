(function () {
    "use strict";
    function attachmentStatus() {
        return function (attachment) {
            if (!attachment)
                return "";
            if (attachment.isValid)
                return "Exists";
            if(attachment.isUploading)
                return "Uploading";
            return "Uploaded";
        };
    }
    angular.module("StoneService.Filters").filter("attachmentStatus", attachmentStatus);
})();