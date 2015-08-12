angular.module('vmBoxModule', [])
.controller('BoxController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
  
    var config = { headers: {      
            'Accept': 'application/json;odata=verbose'
        }
    };
    
    $scope.loadJSON = function(apiLink) {
        $http.get(apiLink, config)
        .success(function(response) {
            $scope.boxes = response;
            
            convertBoxColors();
            console.log(response);          
        })
        .error(function(data, status, headers, config) {
            //alert(JSON.stringify(error));
        });
    };    
    
    function init(){    
        $timeout(function() {
            //$(".minimus-slider:eq(0)").minimus();
            for (i = 0; i < $(".slider").length; i++ ) {
                $(".slider:eq(" + i + ")").muslider({
                    /*"animation_start": "auto",
                    "ratio": "reference",
                    "animation_duration": 800,*/                    
                    "animation_type": "horizontal",                    
                    "width": "100%"
                });
            }

            
            var basicMP3Player = null;

            soundManager.setup({
              preferFlash: false,
              onready: function() {
                basicMP3Player = new BasicMP3Player();
              }
            });
            
            //
            
            $(window).resize(function()
            {
                for (i = 0; i < $(".imgslider").length; i++ ) {
                    var wrapper_height = $(".imgslider:eq(" + i + ")").height(),
                        wrapper_width = $(".imgslider:eq(" + i + ")").width();                    
                        
                    $(".imgslider:eq(" + i + ") .navslide").css({"font-size":wrapper_width*0.0035+0.8+"em"}).promise().done(function()
                    {
                        var navslide_height = $(".prev:eq(0)").height();
                        $(this).css({"top": Math.round((wrapper_height-navslide_height)/2)+"px"});                            
                        $(this).css({"display": "block"});
                    });
                }
            });
            
            $(window).resize();
                
        }, 500);
    }
            
    init();
    
    $scope.loadFromString = function(json_text) {
        if (json_text) {
          $scope.boxes = JSON.parse(json_text);
        }
        init();
    };
    
    function convertBoxColors() {
        for (var i = 0, len = $scope.boxes.length; i < len; i++) {            
            $scope.boxes[i].BackgroundColor = getRGBAColor($scope.boxes[i].BackgroundColor);
            $scope.boxes[i].BoxItems.forEach( function(entry) {
                if (entry.Type == "Text" || entry.Type == "PostedBy" || entry.Type == "PictureText") {
                    entry.BackgroundColor = getRGBAColor(entry.BackgroundColor);
                    entry.TextColor = getRGBAColor(entry.TextColor);
                } else if (entry.Type == "Stamp") {
                    entry.BackgroundColor = getRGBAColor(entry.BackgroundColor);
                } else if (entry.Type == "File" || entry.Type == "Folder") {
                    entry.HeaderTextColor = getRGBAColor(entry.HeaderTextColor);
                    entry.DescriptionTextColor = getRGBAColor(entry.DescriptionTextColor);
                } else if (entry.Type == "TextButton") {
                    entry.ButtonTextColor = getRGBAColor(entry.ButtonTextColor);
                    entry.ButtonBackgroundColor = getRGBAColor(entry.ButtonBackgroundColor);
                    entry.BackgroundColor = getRGBAColor(entry.BackgroundColor);
                    entry.TextColor = getRGBAColor(entry.TextColor);
                }
            });
        }
    }
    
    function getRGBAColor(hex) {
        if (hex == null) return null;
        hex = hex.replace('#','');
        r = parseInt(hex.substring(0,2), 16);
        g = parseInt(hex.substring(2,4), 16);
        b = parseInt(hex.substring(4,6), 16);
        a = parseInt(hex.substring(6,8), 16);

        hex = "rgba(" + r + "," + g + "," + b + "," + a / 255 + ")";
        return hex;
    }
    
    $scope.getLikeCount = function(box) {
        return box.LikeCount;
    };
    
    $scope.getCommentCount = function(box) {
        return box.CommentCount;
    };
    
    $scope.getOfferCount = function(box) {
        return box.OfferCount;
    };
    
    $scope.setLikeCount = function(box, count) {
        if (count == box.LikeCount + 1) 
            box.LikeStatus = true;
        else
            box.LikeStatus = false;
        box.LikeCount = count;
    };
    
    
    $scope.outputText = function(boxItem, box) {
        var res = boxItem.Content;
        if (box.LikeCount > 1) res = res.replace("%Likes%", '<a class="like-count">' + box.LikeCount + " Likes" + '</a>');
        else if (box.LikeCount == 1) res = res.replace("%Likes%", '<a class="like-count">' + box.LikeCount + " Like" + '</a>');
        else res = res.replace("%Likes%", "");
        
        if (box.CommentCount > 1) res = res.replace("%Comments%", '<a class="comment-count">' + box.CommentCount + " Comments" + '</a>');
        else if (box.CommentCount == 1) res = res.replace("%Comments%", '<a class="comment-count">' + box.CommentCount + " Comment" + '</a>');
        else res = res.replace("%Comments%", "");
        
        if (box.OfferCount > 1) res = res.replace("%Offers%", '<a class="offer-count">' + box.OfferCount + " Offers" + '</a>');
        else if (box.OfferCount == 1) res = res.replace("%Offers%", '<a class="offer-count">' + box.OfferCount + " Offer" + '</a>');
        else res = res.replace("%Offers%", "");
        
        return res;
    }
    
    $scope.textItemStyle = function(boxItem) {                
        result = "";
        if ( boxItem.BackgroundImage ) result = "background: url(" + boxItem.BackgroundImage + ") center no-repeat;";
        if ( boxItem.BackgroundColor ) result += "background-color: " + boxItem.BackgroundColor + ";";
        
        if ( boxItem.Font ) result += "font-family: " + boxItem.Font + ";";
        if ( boxItem.FontSize ) result += "font-size: " + boxItem.FontSize + ";";
        if ( boxItem.TextColor ) result += "color: " + boxItem.TextColor + ";";
        if ( boxItem.FontBold ) result += "font-weight: bold;";
        if ( boxItem.FontItalic ) result += "font-style: italic;";
        
        return result;
    }
    
    $scope.textButtonItemStyle = function(boxItem) {                
        result = "";
        if ( boxItem.BackgroundImage ) result = "background: url(" + boxItem.BackgroundImage + ") center no-repeat;";
        if ( boxItem.BackgroundColor ) result += "background-color: " + boxItem.BackgroundColor + ";";
        
        if ( boxItem.Font ) result += "font-family: " + boxItem.Font + ";";
        if ( boxItem.FontSize ) result += "font-size: " + boxItem.FontSize + ";";
        if ( boxItem.TextColor ) result += "color: " + boxItem.TextColor + ";";
        if ( boxItem.FontBold ) result += "font-weight: bold;";
        if ( boxItem.FontItalic ) result += "font-style: italic;";
        
        return result;
    }
    
    $scope.textButtonStyle = function(boxItem) {                
        result = "";        
        if ( boxItem.ButtonWidth ) result += "width: " + boxItem.ButtonWidth + "px;";
        if ( boxItem.ButtonHeight ) result += "height: " + boxItem.ButtonHeight + "px;";
        if ( boxItem.ButtonHeight ) result += "line-height: " + boxItem.ButtonHeight + "px;";
        if ( boxItem.ButtonFont ) result += "font-family: " + boxItem.ButtonFont + ";";
        if ( boxItem.ButtonFontSize ) result += "font-size: " + boxItem.ButtonFontSize + ";";
        if ( boxItem.ButtonFontBold ) result += "font-weight: bold;";
        if ( boxItem.ButtonFontItalic ) result += "font-style: italic;";
        if ( boxItem.ButtonImage ) result += "background-image: url(" + boxItem.ButtonImage + ");";
        
        return result;
    }
    
    $scope.textButtonWrapperStyle = function(boxItem, messageId) {
        result = "";
        str = boxItem.ButtonPosition.split("-");
        if (str[0] == "float") {
            result += "float: " + str[1] + ";";
        } else {
            result += "text-align: " + str[1];
        }
        return result;
    }
    
    
    $scope.postedByItemStyle = $scope.pictureTextItemStyle = function(boxItem) {        
        result = "";        
        if ( boxItem.BackgroundImage ) result = "background: url(" + boxItem.BackgroundImage + ") center no-repeat;";
        if ( boxItem.BackgroundColor ) result += "background-color: " + boxItem.BackgroundColor + ";";
        
        return result;        
    }   
    
    $scope.postedByItemImgStyle = function(boxItem) {
        result = "";
        if ( boxItem.Image ) result = "background: url(" + boxItem.Image + ") center no-repeat;";
        return result;
    }
    
    $scope.postedByItemTextStyle = function(boxItem) {
        result = "";
        if ( boxItem.FontSize ) result = "font-size: " + boxItem.FontSize + ";";
        if ( boxItem.TextColor ) result += "color: " + boxItem.TextColor + ";";
        return result;
    }
    
    $scope.stampItemStyle = function(boxItem) {
        result = "";
        str = boxItem.Position.split("-");
        result = str[0] + ": 0px;" + str[1] + ": 0px;";
        result += "margin: " + boxItem.Margin + ";";        
        return result;    
    }
    
    $scope.stampItemImgStyle = function(boxItem, messageId) {        
        boxWidth = $("#" + messageId).width();
        imageSizePercent = parseInt(boxItem.ImageSizePercent.replace('%', '')) / 100;
        
        result = "";                                                                                                                                
        result = "width: " + (boxWidth * imageSizePercent * boxItem.Width / boxItem.Height) + "px;height: " + (boxWidth * imageSizePercent * 1) + "px;";        
        return result;
    }
    
    $scope.pictureTextTextStyle = function(boxItem) {                
        result = "";
        if ( boxItem.Font ) result += "font-family: " + boxItem.Font + ";";
        if ( boxItem.FontSize ) result += "font-size: " + boxItem.FontSize + ";";
        if ( boxItem.TextColor ) result += "color: " + boxItem.TextColor + ";";
        if ( boxItem.FontBold ) result += "font-weight: bold;";
        if ( boxItem.FontItalic ) result += "font-style: italic;";
        return result;
    }
                 
    $scope.pictureTextImgWrapperStyle = $scope.fileImgWrapperStyle = $scope.folderImgWrapperStyle = function(boxItem, messageId) {
        result = "";
        str = boxItem.ImagePosition.split("-");
        if (str[0] == "float") {
            result += "float: " + str[1] + ";";
        } else {
            result += "text-align: " + str[1];
        }
        return result;
    }
    
    $scope.pictureTextImgStyle = function(boxItem, messageId, percent) {

        boxWidth = $("#" + messageId).width();        
        imageSizePercent = parseInt(boxItem.ImageSizePercent.replace('%', '')) / 100;                
        result = "";                
        //if ( boxItem.Image ) result = "background: url(" + boxItem.Image + ") center no-repeat;";
        
        if (percent) {
            imageSizePercent = percent / 100;
            result += "width: " + (boxWidth * imageSizePercent) + "px;";
            result += "height: " + ((boxWidth * imageSizePercent) / boxItem.ImageWidth) * boxItem.ImageHeight + "px;";
        } else {
            //result += "width: " + (boxWidth * imageSizePercent * boxItem.ImageWidth / boxItem.ImageHeight) + "px;height: " + (boxWidth * imageSizePercent * 1) + "px;";    
            result += "width: " + (imageSizePercent * boxItem.ImageWidth) + "px;height: " + (imageSizePercent * boxItem.ImageHeight) + "px;";    
        }
        
        str = boxItem.ImagePosition.split("-");
        return result;
    }
    
    $scope.fileItemImgStyle = $scope.folderItemImgStyle = function(boxItem, messageId) {        
        boxWidth = $("#" + messageId).width();
        imageSizePercent = parseInt(boxItem.ImageSizePercent.replace('%', '')) / 100;
        
        //result = "width: " + (boxWidth * imageSizePercent) + "px;";        
        result = "width: " + (boxWidth * imageSizePercent * boxItem.ImageWidth / boxItem.ImageHeight) + "px;height: " + (boxWidth * imageSizePercent * 1) + "px;";
        return result;
    }
    
    $scope.fileItemTextStyle = $scope.folderItemTextStyle = function(boxItem) {
        result = "";
        if ( boxItem.HeaderFont ) result += "font-family: " + boxItem.HeaderFont + ";";
        if ( boxItem.HeaderFontSize ) result += "font-size: " + boxItem.HeaderFontSize + ";";
        if ( boxItem.HeaderTextColor ) result += "color: " + boxItem.HeaderTextColor + ";";
        if ( boxItem.HeaderFontBold ) result += "font-weight: bold;";
        if ( boxItem.HeaderFontItalic ) result += "font-style: italic;";
        return result;
    }
    
    $scope.fileItemDescTextStyle = $scope.folderItemDescTextStyle = function(boxItem) {
        result = "";
        if ( boxItem.DescriptionFont ) result += "font-family: " + boxItem.DescriptionFont + ";";
        if ( boxItem.DescriptionFontSize ) result += "font-size: " + boxItem.DescriptionFontSize + ";";
        if ( boxItem.DescriptionTextColor ) result += "color: " + boxItem.DescriptionTextColor + ";";
        if ( boxItem.DescriptionFontBold ) result += "font-weight: bold;";
        if ( boxItem.DescriptionFontItalic ) result += "font-style: italic;";
        return result;
    }
    
    $scope.timeAgo = function (myDate) {

        var newDate = new Date();
        var date =new Date(myDate);
        date = new Date(date.valueOf() + newDate.getTimezoneOffset() * 60000);
        var delta = (newDate - date)/1000;

        var res="";
        try{
            if(delta < 10)
                res='Just now.';
            else if (delta >=10 && delta < 120)
                res= 'about a minute ago.';
            else if (delta >=120 && delta < (3400) )
                res = Math.round(delta / 60) + ' minutes ago.';
            else if (delta >=3400 && delta < (3600*2))
                res = 'about an hour ago.';
            
            else if (delta >=(3600*2) && delta < (3600 * 23))
                res= Math.round(delta / 3600) + ' hours ago.';
            
            else if (delta >= (3600 *23) && delta < (3600 *48))
                res= 'yesterday.';
            
            else if (delta >= (3600 *48) && delta < (3600 *24 * 30))
                res = Math.round(delta / (3600*24)) + ' days ago.';

            else if (delta >= (3600 *24 *30) && delta < (3600 *24 * 60))
                res = 'about a month ago.';
            
            else if (delta >=(3600 *24*60) && delta < (3600*24*350)  )
                res = Math.round(delta / (3600*24*30.4)) + ' months ago.';
            
            else if (delta >=(3600 *24*350) && delta < (3600 *24*365*2))
                res= 'about a year ago.';
            
            else if (delta >= (3600 *24*365*2))
                res = Math.round(delta / (3600*24*365.1)) + ' years ago.';
            
        }
        catch(e){
            
        }
        return res;    
    }
    
}])

.filter('trustUrl', function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
})

.filter('trustAsHtml', function ($sce) {
    return function(text) {
      return $sce.trustAsHtml(text);
    };
})

.directive('box', function() {
    return {
        restrict: 'E',
        templateUrl: 'box/box.html',
        
        controller: function ($scope, $element) {
            $scope.actionButtonClicked = function (type, box) {
                //problematic line HERE
                $("#" + box.MessageId + " .action-button a." + type).trigger("onActionButton", [type, box]);
            };
            
            $scope.textButtonClicked = function (type, box) {
                //problematic line HERE
                $("#" + box.MessageId + " .text-button a." + type).trigger("onTextButton", [type, box]);
            };
            
        }
    };
});


