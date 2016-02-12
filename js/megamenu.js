jQuery(document).ready(function() {

    jQuery(".df-loading").hide();

    jQuery('#page').hide().fadeIn();

    var urlWP = ajax_script.ajaxurl;

    var tmpData = {};
    var tmpInnerData = {};
    var tmpOuterIndex;
    var tmpCurrentPage;
    var tmpCatId;
    var tmpNoItem;
    var curPage;
    var subCat;

    nextMegaMenu(); // call nextMegaMenu()
    prevMegaMenu(); // call prevMegaMenu()

    /*
     * next content post
     */
    function nextMegaMenu(){
        jQuery('.next_megamenu').click(function(e){
            e.preventDefault();

            noItem = jQuery(this).data('item');  
            categoryId = jQuery(this).data('cat');
            totalPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
            postsPerPage = jQuery(".df-posts-per-page-"+categoryId+"-"+noItem).val();
            currentPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
            hasSubCat = jQuery(".df-has-sub-cat-"+categoryId+"-"+noItem).val();

            nextIndex = parseInt(currentPage) + 1;
            outerIndex = "df-megamenu-"+categoryId+"-"+noItem;

            console.log("cat: "+categoryId+", no item: "+noItem);
            // console.log("total: " +totalPages);
            // console.log("postsPerPage: " +postsPerPage);

            if(hasSubCat == "false"){
                /*
                 * IF NO SUB CATEGORIES POSTS
                 */
                 
                if(typeof tmpData[outerIndex] === "undefined"){
                    console.log("undefined");
                    console.log(outerIndex);
                    tmpInnerData = {};
                    tmpData[outerIndex] = tmpInnerData;
                }else{
                    console.log("defined");
                    console.log(outerIndex);
                }

                if(typeof tmpOuterIndex === "undefined"){
                    console.log("tmpOuterIndex undefined");
                    tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").html();
                    console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                }else{
                    console.log("tmpOuterIndex defined");
                    console.log("tmpOuterIndex: " +tmpOuterIndex);  

                    if(tmpOuterIndex == outerIndex){
                        console.log("tmpOuterIndex == outerIndex");
                        tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                        console.log("next ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                    }else{
                        console.log("tmpOuterIndex != outerIndex");

                        if(subCat == "true"){
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+tmpCatId+"-"+tmpNoItem+" .row-inner").html();
                        }else{
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+tmpCatId+"-"+tmpNoItem+" .row").html();
                        }

                        tmpData[outerIndex][currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                        console.log("next ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");

                        // CHECK IF 
                        //tmpInnerData[nextIndex] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").html();

                    }

                }

                objInside = tmpData[outerIndex];

                if(Object.keys(objInside).length != 0 ){

                    check = objInside[nextIndex];
                    if( check == null ){
                        // call ajax again
                        console.log("next ["+outerIndex+"] get from ajax [if null] ");
                        jQuery.ajax({
                            type: 'POST',
                            url: urlWP,
                            data: {
                                action: 'getNextPage', 
                                no_item: noItem,
                                category_id: categoryId,
                                total_pages: totalPages,
                                posts_per_page: postsPerPage,
                                current_page: currentPage,
                                has_sub_cat: hasSubCat,
                                type: 'next'
                            },
                            beforeSend: function(){
                                jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                                jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                                // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                                // console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                                jQuery(".df-block-inner-megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                                jQuery(".df-loading-"+categoryId+"-"+noItem).show();
                            },
                            success: function(data){
                                jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                                jQuery('.df-loading-'+categoryId+"-"+noItem).hide(function(){
                                    // remove style in prev link
                                    jQuery("#prev-"+categoryId+"-"+noItem).removeAttr( "style" );

                                    // add next content to .df-block-megamenu-[cat id]-[no item]
                                    jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").prepend(data).fadeIn('slow', function(){
                                        cPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
                                        tPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
                                        if(cPage == tPages){
                                            jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                            jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                                            jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                                        }
                                    });  
                                    tmpInnerData[nextIndex] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").html();
                                    console.log("next ["+outerIndex+"] fill tmpInnerData["+nextIndex+"]");
                                });
                            }
                        });
                    }else{
                        jQuery(".df-block-inner-megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                        jQuery('.df-loading-'+categoryId+"-"+noItem).hide().remove();
                        // remove style in prev link
                        jQuery("#prev-"+categoryId+"-"+noItem).removeAttr( "style" );

                        console.log("next ["+outerIndex+"] get from json ");
                        // add next content to .df-block-megamenu-[cat id]-[no item]
                        jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").prepend(tmpData[outerIndex][nextIndex]).fadeIn('slow', function(){
                            cPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
                            tPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
                            if(cPage == tPages){
                                jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                                jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                            }
                        });  
                    }
                }else{
                    console.log("next ["+outerIndex+"] get from ajax [first] ");
                    jQuery.ajax({
                        type: 'POST',
                        url: urlWP,
                        data: {
                            action: 'getNextPage', 
                            no_item: noItem,
                            category_id: categoryId,
                            total_pages: totalPages,
                            posts_per_page: postsPerPage,
                            current_page: currentPage,
                            has_sub_cat: hasSubCat,
                            type: 'next'
                        },
                        beforeSend: function(){
                            jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                            jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                            jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                            // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                            // console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                            jQuery(".df-block-inner-megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                            jQuery(".df-loading-"+categoryId+"-"+noItem).show();
                        },
                        success: function(data){
                            jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                            jQuery('.df-loading-'+categoryId+"-"+noItem).hide(function(){
                                // remove style in prev link
                                jQuery("#prev-"+categoryId+"-"+noItem).removeAttr( "style" );
                                // add next content to .df-block-megamenu-[cat id]-[no item]
                                jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").prepend(data).fadeIn('slow', function(){
                                    cPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
                                    tPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
                                    if(cPage == tPages){
                                        jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                        jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                                        jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                                    }
                                    tmpInnerData[nextIndex] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").html();
                                    console.log("next ["+outerIndex+"] fill tmpInnerData["+nextIndex+"]");
                                });  
                                
                            });
                            
                            
                        }
                    });
                }
                
                tmpOuterIndex = outerIndex;
                tmpCurrentPage = nextIndex;
                tmpCatId = categoryId;
                tmpNoItem = noItem;
                subCat = "false";
                console.log("next ["+outerIndex+"] size tmpData: " + Object.keys(tmpData).length);
                console.log("next ["+outerIndex+"] content tmpData: ");
                console.log(tmpData);
                console.log("=======================================================================");

                
            }else{
                /*
                 * IF SUB CATEGORIES POSTS EXIST
                 */

                if(typeof tmpData[outerIndex] === "undefined"){
                    console.log("undefined");
                    console.log(outerIndex);
                    tmpInnerData = {};
                    tmpData[outerIndex] = tmpInnerData;
                }else{
                    console.log("defined");
                    console.log(outerIndex);
                }

                if(typeof tmpOuterIndex === "undefined"){
                    console.log("tmpOuterIndex undefined");
                    tmpInnerData[currentPage] = jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").html();
                    console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                }else{
                    console.log("tmpOuterIndex defined");
                    console.log("tmpOuterIndex: " +tmpOuterIndex);  

                    if(tmpOuterIndex == outerIndex){
                        console.log("tmpOuterIndex == outerIndex");
                        tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                        console.log("next ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                    }else{
                        console.log("tmpOuterIndex != outerIndex");

                        if(subCat == "true"){
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+tmpCatId+"-"+tmpNoItem+" .row-inner").html();
                        }else{
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+tmpCatId+"-"+tmpNoItem+" .row").html();
                        }
                        //tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+tmpCatId+"-"+tmpNoItem+" .row-inner").html();

                        tmpData[outerIndex][currentPage] = jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                        console.log("next ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                    }
                }

                objInside = tmpData[outerIndex];

                if(Object.keys(objInside).length != 0 ){

                    check = objInside[nextIndex];
                    if( check == null ){
                        // call ajax again
                        console.log("next ["+outerIndex+"] get from ajax [if null] ");
                        jQuery.ajax({
                            type: 'POST',
                            url: urlWP,
                            data: {
                                action: 'getNextPage', 
                                no_item: noItem,
                                category_id: categoryId,
                                total_pages: totalPages,
                                posts_per_page: postsPerPage,
                                current_page: currentPage,
                                has_sub_cat: hasSubCat,
                                type: 'next'
                            },
                            beforeSend: function(){
                                jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                                jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                                // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                                // console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                                jQuery(".df-block-inner-megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                                jQuery(".df-loading-"+categoryId+"-"+noItem).show();
                            },
                            success: function(data){
                                jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                                jQuery('.df-loading-'+categoryId+"-"+noItem).hide(function(){
                                    // remove style in prev link
                                    jQuery("#prev-"+categoryId+"-"+noItem).removeAttr( "style" );

                                    // add next content to .df-block-megamenu-[cat id]-[no item]
                                    jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").prepend(data).fadeIn('slow', function(){
                                        cPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
                                        tPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
                                        if(cPage == tPages){
                                            jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                            jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                                            jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                                        }
                                    });  
                                    tmpInnerData[nextIndex] = jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").html();
                                    console.log("next ["+outerIndex+"] fill tmpInnerData["+nextIndex+"]");
                                });
                            }
                        });
                    }else{
                        jQuery(".df-block-inner-megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                        jQuery('.df-loading-'+categoryId+"-"+noItem).hide().remove();
                        // remove style in prev link
                        jQuery("#prev-"+categoryId+"-"+noItem).removeAttr( "style" );

                        console.log("next ["+outerIndex+"] get from json ");
                        // add next content to .df-block-megamenu-[cat id]-[no item]
                        jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").prepend(tmpData[outerIndex][nextIndex]).fadeIn('slow', function(){
                            cPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
                            tPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
                            if(cPage == tPages){
                                jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                                jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                            }
                        });  
                    }
                }else{
                    console.log("next ["+outerIndex+"] get from ajax [first] ");
                    jQuery.ajax({
                        type: 'POST',
                        url: urlWP,
                        data: {
                            action: 'getNextPage', 
                            no_item: noItem,
                            category_id: categoryId,
                            total_pages: totalPages,
                            posts_per_page: postsPerPage,
                            current_page: currentPage,
                            has_sub_cat: hasSubCat,
                            type: 'next'
                        },
                        beforeSend: function(){
                            jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                            jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                            jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                            // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                            // console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                            jQuery(".df-block-inner-megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                            jQuery(".df-loading-"+categoryId+"-"+noItem).show();
                        },
                        success: function(data){
                            jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                            jQuery('.df-loading-'+categoryId+"-"+noItem).hide(function(){
                                // remove style in prev link
                                jQuery("#prev-"+categoryId+"-"+noItem).removeAttr( "style" );
                                // add next content to .df-block-megamenu-[cat id]-[no item]
                                jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").prepend(data).fadeIn('slow', function(){
                                    cPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
                                    tPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
                                    if(cPage == tPages){
                                        jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                        jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                                        jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                                    }
                                    tmpInnerData[nextIndex] = jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").html();
                                    console.log("next ["+outerIndex+"] fill tmpInnerData["+nextIndex+"]");
                                });  
                                
                            });
                            
                            
                        }
                    });
                }
                
                tmpOuterIndex = outerIndex;
                tmpCurrentPage = nextIndex;
                tmpCatId = categoryId;
                tmpNoItem = noItem;
                subCat = "true";
                console.log("next ["+outerIndex+"] size tmpData: " + Object.keys(tmpData).length);
                console.log("next ["+outerIndex+"] content tmpData: ");
                console.log(tmpData);
                console.log("=======================================================================");
            }

            
        })
    }
    

    /*
     * prev content post
     */
    function prevMegaMenu(){
        jQuery('.prev_megamenu').click(function(e){
            e.preventDefault();

            noItem = jQuery(this).data('item');  
            categoryId = jQuery(this).data('cat');
            totalPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
            postsPerPage = jQuery(".df-posts-per-page-"+categoryId+"-"+noItem).val();
            currentPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
            hasSubCat = jQuery(".df-has-sub-cat-"+categoryId+"-"+noItem).val();
            // categoryId = jQuery(".category_id-" +noItem).val();

            prevIndex = parseInt(currentPage) - 1;
            outerIndex = "df-megamenu-"+categoryId+"-"+noItem;

            console.log("cat: "+categoryId+", no item: "+noItem);

            if(hasSubCat == "false"){
                /*
                 * IF NO SUB CATEGORIES POSTS
                 */
                if(typeof tmpData[outerIndex] === "undefined"){
                    console.log("undefined");
                    console.log(outerIndex);
                    tmpInnerData = {};
                    tmpData[outerIndex] = tmpInnerData;
                }else{
                    console.log("defined");
                    console.log(outerIndex);
                }
                objInside = tmpData[outerIndex];
                
                if(typeof tmpOuterIndex === "undefined"){
                    console.log("tmpOuterIndex undefined");
                }else{
                    console.log("tmpOuterIndex defined");
                    console.log("tmpOuterIndex: " +tmpOuterIndex);

                    if(tmpOuterIndex == outerIndex){
                        console.log("tmpOuterIndex == outerIndex");
                        tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                        console.log("prev ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                    }else{
                        console.log("tmpOuterIndex != outerIndex");
                        if(subCat == "true"){
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+tmpCatId+"-"+tmpNoItem+" .row-inner").html();
                        }else{
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+tmpCatId+"-"+tmpNoItem+" .row").html();
                        }
                        //tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+tmpCatId+"-"+tmpNoItem+" .row").html();
                        
                        tmpData[outerIndex][currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                        console.log("prev ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                    }

                }

                if(Object.keys(objInside).length != 0){

                    check = objInside[prevIndex];
                    if( check == null ){
                        // call ajax again
                        console.log("prev ["+outerIndex+"] get from ajax [if null] ");
                        jQuery.ajax({
                            type: 'POST',
                            url: urlWP,
                            data: {
                                action: 'getPrevPage', 
                                no_item: noItem,
                                category_id: categoryId,
                                total_pages: totalPages,
                                posts_per_page: postsPerPage,
                                current_page: currentPage,
                                has_sub_cat: hasSubCat,
                                type: 'prev'
                            },
                            beforeSend: function(){
                                // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                                // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                                jQuery(".df-block-inner-megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                                jQuery(".df-loading-"+categoryId+"-"+noItem).show();
                            },
                            success: function(data){
                                jQuery('.df-loading-'+categoryId+"-"+noItem).hide(function(){
                                    jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").prepend(data).fadeIn('slow', function(){
                                        cPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
                                        tPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
                                        if(cPage == '1'){
                                            jQuery("#prev-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                            jQuery("#prev-"+categoryId+"-"+noItem).css("cursor", 'default');
                                            jQuery("#prev-"+categoryId+"-"+noItem).css("color", '#ccc');
                                            // remove style in prev link
                                            jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                                        }
                                    });  
                                });
                            }
                        })
                    }else{
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                        // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                        jQuery(".df-block-inner-megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                        jQuery('.df-loading-'+categoryId+"-"+noItem).hide().remove();

                        console.log("prev ["+outerIndex+"] get from json ");

                        jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").prepend(tmpData[outerIndex][prevIndex]).fadeIn('slow', function(){
                            cPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
                            tPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
                            if(cPage < tPages){

                                if(cPage == '1'){
                                    jQuery("#prev-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                    jQuery("#prev-"+categoryId+"-"+noItem).css("cursor", 'default');
                                    jQuery("#prev-"+categoryId+"-"+noItem).css("color", '#ccc');
                                    // remove style in prev link
                                    jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                                }else{
                                    jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                                    jQuery("#prev-"+categoryId+"-"+noItem).removeAttr( "style" );
                                } 
                            }
                        });
                    }
                }else{

                    console.log("prev ["+outerIndex+"] get from ajax [first] ");
                    jQuery.ajax({
                        type: 'POST',
                        url: urlWP,
                        data: {
                            action: 'getPrevPage', 
                            no_item: noItem,
                            category_id: categoryId,
                            total_pages: totalPages,
                            posts_per_page: postsPerPage,
                            current_page: currentPage,
                            has_sub_cat: hasSubCat,
                            type: 'prev'
                        },
                        beforeSend: function(){
                            // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                            // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                            jQuery(".df-block-inner-megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                            jQuery(".df-loading-"+categoryId+"-"+noItem).show();
                        },
                        success: function(data){
                            jQuery('.df-loading-'+categoryId+"-"+noItem).hide(function(){
                                jQuery(".df-block-megamenu-"+categoryId+"-"+noItem+" .row").prepend(data).fadeIn('slow', function(){
                                    cPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
                                    tPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
                                    if(cPage == '1'){
                                        jQuery("#prev-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                        jQuery("#prev-"+categoryId+"-"+noItem).css("cursor", 'default');
                                        jQuery("#prev-"+categoryId+"-"+noItem).css("color", '#ccc');
                                        // remove style in prev link
                                        jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                                    }
                                });  
                            });
                        }
                    })
                }

                tmpOuterIndex = outerIndex;
                tmpCurrentPage = prevIndex;
                tmpCatId = categoryId;
                tmpNoItem = noItem;
                subCat = "false";

                console.log("prev ["+outerIndex+"] size tmpData: " + Object.keys(tmpData).length);
                console.log("prev ["+outerIndex+"] content tmpData: ");
                console.log(tmpData);
                console.log("=======================================================================");
            }else{
                /*
                 * IF SUB CATEGORIES POSTS EXIST
                 */
                if(typeof tmpData[outerIndex] === "undefined"){
                    console.log("undefined");
                    console.log(outerIndex);
                    tmpInnerData = {};
                    tmpData[outerIndex] = tmpInnerData;
                }else{
                    console.log("defined");
                    console.log(outerIndex);
                }
                objInside = tmpData[outerIndex];
                
                if(typeof tmpOuterIndex === "undefined"){
                    console.log("tmpOuterIndex undefined");
                }else{
                    console.log("tmpOuterIndex defined");
                    console.log("tmpOuterIndex: " +tmpOuterIndex);

                    if(tmpOuterIndex == outerIndex){
                        console.log("tmpOuterIndex == outerIndex");
                        tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                        console.log("prev ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                    }else{
                        console.log("tmpOuterIndex != outerIndex");
                        if(subCat == "true"){
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+tmpCatId+"-"+tmpNoItem+" .row-inner").html();
                        }else{
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+tmpCatId+"-"+tmpNoItem+" .row").html();
                        }
                        // tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+tmpCatId+"-"+tmpNoItem+" .row-inner").html();
                        
                        tmpData[outerIndex][currentPage] = jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                        console.log("prev ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                    }

                }

                if(Object.keys(objInside).length != 0){

                    check = objInside[prevIndex];
                    if( check == null ){
                        // call ajax again
                        console.log("prev ["+outerIndex+"] get from ajax [if null] ");
                        jQuery.ajax({
                            type: 'POST',
                            url: urlWP,
                            data: {
                                action: 'getPrevPage', 
                                no_item: noItem,
                                category_id: categoryId,
                                total_pages: totalPages,
                                posts_per_page: postsPerPage,
                                current_page: currentPage,
                                has_sub_cat: hasSubCat,
                                type: 'prev'
                            },
                            beforeSend: function(){
                                // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                                // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                                jQuery(".df-block-inner-megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                                jQuery(".df-loading-"+categoryId+"-"+noItem).show();
                            },
                            success: function(data){
                                jQuery('.df-loading-'+categoryId+"-"+noItem).hide(function(){
                                    jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").prepend(data).fadeIn('slow', function(){
                                        cPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
                                        tPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
                                        if(cPage == '1'){
                                            jQuery("#prev-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                            jQuery("#prev-"+categoryId+"-"+noItem).css("cursor", 'default');
                                            jQuery("#prev-"+categoryId+"-"+noItem).css("color", '#ccc');
                                            // remove style in prev link
                                            jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                                        }
                                    });  
                                });
                            }
                        })
                    }else{
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                        // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                        jQuery(".df-block-inner-megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                        jQuery('.df-loading-'+categoryId+"-"+noItem).hide().remove();

                        console.log("prev ["+outerIndex+"] get from json ");

                        jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").prepend(tmpData[outerIndex][prevIndex]).fadeIn('slow', function(){
                            cPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
                            tPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
                            if(cPage < tPages){

                                if(cPage == '1'){
                                    jQuery("#prev-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                    jQuery("#prev-"+categoryId+"-"+noItem).css("cursor", 'default');
                                    jQuery("#prev-"+categoryId+"-"+noItem).css("color", '#ccc');
                                    // remove style in prev link
                                    jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                                }else{
                                    jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                                    jQuery("#prev-"+categoryId+"-"+noItem).removeAttr( "style" );
                                } 
                            }
                        });
                    }
                }else{

                    console.log("prev ["+outerIndex+"] get from ajax [first] ");
                    jQuery.ajax({
                        type: 'POST',
                        url: urlWP,
                        data: {
                            action: 'getPrevPage', 
                            no_item: noItem,
                            category_id: categoryId,
                            total_pages: totalPages,
                            posts_per_page: postsPerPage,
                            current_page: currentPage,
                            has_sub_cat: hasSubCat,
                            type: 'prev'
                        },
                        beforeSend: function(){
                            // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+noItem).html();
                            // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                            jQuery(".df-block-inner-megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                            jQuery(".df-loading-"+categoryId+"-"+noItem).show();
                        },
                        success: function(data){
                            jQuery('.df-loading-'+categoryId+"-"+noItem).hide(function(){
                                jQuery(".df-tab-content-inner-"+categoryId+"-"+noItem+" .row-inner").prepend(data).fadeIn('slow', function(){
                                    cPage = jQuery(".df-current-page-"+categoryId+"-"+noItem).val();
                                    tPages = jQuery(".df-total-pages-"+categoryId+"-"+noItem).val();
                                    if(cPage == '1'){
                                        jQuery("#prev-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                        jQuery("#prev-"+categoryId+"-"+noItem).css("cursor", 'default');
                                        jQuery("#prev-"+categoryId+"-"+noItem).css("color", '#ccc');
                                        // remove style in prev link
                                        jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                                    }
                                });  
                            });
                        }
                    })
                }

                tmpOuterIndex = outerIndex;
                tmpCurrentPage = prevIndex;
                tmpCatId = categoryId;
                tmpNoItem = noItem;
                subCat = "true";

                console.log("prev ["+outerIndex+"] size tmpData: " + Object.keys(tmpData).length);
                console.log("prev ["+outerIndex+"] content tmpData: ");
                console.log(tmpData);
                console.log("=======================================================================");

            }

            
        })
    }

    // function checkTmpData(){

    // }

    // function checkTmpOuterData(){

    // }
});
