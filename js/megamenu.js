jQuery(document).ready(function() {
    /* 
     *jQuery for megamenu sub categories hover 
     */
    jQuery('.df-megamenu-nav-sub a').hover(function(e){
        e.preventDefault();
        jQuery('.tab-pane').removeClass('active');
        tabContentSelector = jQuery(this).attr('href');
        jQuery(this).tab('show');
        jQuery(tabContentSelector).addClass('active');
    });
    jQuery(".df-loading").hide();

    jQuery('#page').hide().fadeIn();

    var urlWP = ajax_megamenu.ajaxurl;
    var tmpData = {};
    var tmpInnerData = {};
    var tmpOuterIndex;
    var tmpCurrentPage;
    var tmpCatId;
    var tmpNumItem;
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

            numItem = jQuery(this).data('item');  
            categoryId = jQuery(this).data('cat');
            totalPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
            postsPerPage = jQuery(".df-posts-per-page-"+categoryId+"-"+numItem).val();
            currentPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
            hasSubCat = jQuery(".df-has-sub-cat-"+categoryId+"-"+numItem).val();

            nextIndex = parseInt(currentPage) + 1;
            outerIndex = "df-megamenu-"+categoryId+"-"+numItem;

            console.log("cat: "+categoryId+", no item: "+numItem);
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
                    tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").html();
                    console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                }else{
                    console.log("tmpOuterIndex defined");
                    console.log("tmpOuterIndex: " +tmpOuterIndex);  

                    if(tmpOuterIndex == outerIndex){
                        console.log("tmpOuterIndex == outerIndex");
                        tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                        console.log("next ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                    }else{
                        console.log("tmpOuterIndex != outerIndex");

                        if(subCat == "true"){
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+tmpCatId+"-"+tmpNumItem+" .row-inner").html();
                        }else{
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+tmpCatId+"-"+tmpNumItem+" .row").html();
                        }

                        tmpData[outerIndex][currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                        console.log("next ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");

                        // CHECK IF 
                        //tmpInnerData[nextIndex] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").html();

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
                                no_item: numItem,
                                category_id: categoryId,
                                total_pages: totalPages,
                                posts_per_page: postsPerPage,
                                current_page: currentPage,
                                has_sub_cat: hasSubCat,
                                type: 'next'
                            },
                            beforeSend: function(){
                                jQuery("#next-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                jQuery("#next-"+categoryId+"-"+numItem).css("cursor", 'default');
                                jQuery("#next-"+categoryId+"-"+numItem).css("color", '#ccc');
                                // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                                // console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                                jQuery(".df-block-inner-megamenu-"+categoryId+"-"+numItem).fadeOut().remove();
                                jQuery(".df-loading-"+categoryId+"-"+numItem).show();
                            },
                            success: function(data){
                                jQuery("#next-"+categoryId+"-"+numItem).removeAttr( "style" );
                                jQuery('.df-loading-'+categoryId+"-"+numItem).hide(function(){
                                    // remove style in prev link
                                    jQuery("#prev-"+categoryId+"-"+numItem).removeAttr( "style" );

                                    // add next content to .df-block-megamenu-[cat id]-[no item]
                                    jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").prepend(data).fadeIn('slow', function(){
                                        cPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
                                        tPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
                                        if(cPage == tPages){
                                            jQuery("#next-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                            jQuery("#next-"+categoryId+"-"+numItem).css("cursor", 'default');
                                            jQuery("#next-"+categoryId+"-"+numItem).css("color", '#ccc');
                                        }
                                    });  
                                    tmpInnerData[nextIndex] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").html();
                                    console.log("next ["+outerIndex+"] fill tmpInnerData["+nextIndex+"]");
                                });
                            }
                        });
                    }else{
                        jQuery(".df-block-inner-megamenu-"+categoryId+"-"+numItem).fadeOut().remove();
                        jQuery('.df-loading-'+categoryId+"-"+numItem).hide().remove();
                        // remove style in prev link
                        jQuery("#prev-"+categoryId+"-"+numItem).removeAttr( "style" );

                        console.log("next ["+outerIndex+"] get from json ");
                        // add next content to .df-block-megamenu-[cat id]-[no item]
                        jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").prepend(tmpData[outerIndex][nextIndex]).fadeIn('slow', function(){
                            cPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
                            tPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
                            if(cPage == tPages){
                                jQuery("#next-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                jQuery("#next-"+categoryId+"-"+numItem).css("cursor", 'default');
                                jQuery("#next-"+categoryId+"-"+numItem).css("color", '#ccc');
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
                            no_item: numItem,
                            category_id: categoryId,
                            total_pages: totalPages,
                            posts_per_page: postsPerPage,
                            current_page: currentPage,
                            has_sub_cat: hasSubCat,
                            type: 'next'
                        },
                        beforeSend: function(){
                            jQuery("#next-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                            jQuery("#next-"+categoryId+"-"+numItem).css("cursor", 'default');
                            jQuery("#next-"+categoryId+"-"+numItem).css("color", '#ccc');
                            // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                            // console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                            jQuery(".df-block-inner-megamenu-"+categoryId+"-"+numItem).fadeOut().remove();
                            jQuery(".df-loading-"+categoryId+"-"+numItem).show();
                        },
                        success: function(data){
                            jQuery("#next-"+categoryId+"-"+numItem).removeAttr( "style" );
                            jQuery('.df-loading-'+categoryId+"-"+numItem).hide(function(){
                                // remove style in prev link
                                jQuery("#prev-"+categoryId+"-"+numItem).removeAttr( "style" );
                                // add next content to .df-block-megamenu-[cat id]-[no item]
                                jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").prepend(data).fadeIn('slow', function(){
                                    cPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
                                    tPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
                                    if(cPage == tPages){
                                        jQuery("#next-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                        jQuery("#next-"+categoryId+"-"+numItem).css("cursor", 'default');
                                        jQuery("#next-"+categoryId+"-"+numItem).css("color", '#ccc');
                                    }
                                    tmpInnerData[nextIndex] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").html();
                                    console.log("next ["+outerIndex+"] fill tmpInnerData["+nextIndex+"]");
                                });  
                                
                            });
                            
                            
                        }
                    });
                }
                
                tmpOuterIndex = outerIndex;
                tmpCurrentPage = nextIndex;
                tmpCatId = categoryId;
                tmpNumItem = numItem;
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
                    tmpInnerData[currentPage] = jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").html();
                    console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                }else{
                    console.log("tmpOuterIndex defined");
                    console.log("tmpOuterIndex: " +tmpOuterIndex);  

                    if(tmpOuterIndex == outerIndex){
                        console.log("tmpOuterIndex == outerIndex");
                        tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                        console.log("next ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                    }else{
                        console.log("tmpOuterIndex != outerIndex");

                        if(subCat == "true"){
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+tmpCatId+"-"+tmpNumItem+" .row-inner").html();
                        }else{
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+tmpCatId+"-"+tmpNumItem+" .row").html();
                        }
                        //tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+tmpCatId+"-"+tmpNumItem+" .row-inner").html();

                        tmpData[outerIndex][currentPage] = jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
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
                                no_item: numItem,
                                category_id: categoryId,
                                total_pages: totalPages,
                                posts_per_page: postsPerPage,
                                current_page: currentPage,
                                has_sub_cat: hasSubCat,
                                type: 'next'
                            },
                            beforeSend: function(){
                                jQuery("#next-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                jQuery("#next-"+categoryId+"-"+numItem).css("cursor", 'default');
                                jQuery("#next-"+categoryId+"-"+numItem).css("color", '#ccc');
                                // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                                // console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                                jQuery(".df-block-inner-megamenu-"+categoryId+"-"+numItem).fadeOut().remove();
                                jQuery(".df-loading-"+categoryId+"-"+numItem).show();
                            },
                            success: function(data){
                                jQuery("#next-"+categoryId+"-"+numItem).removeAttr( "style" );
                                jQuery('.df-loading-'+categoryId+"-"+numItem).hide(function(){
                                    // remove style in prev link
                                    jQuery("#prev-"+categoryId+"-"+numItem).removeAttr( "style" );

                                    // add next content to .df-block-megamenu-[cat id]-[no item]
                                    jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").prepend(data).fadeIn('slow', function(){
                                        cPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
                                        tPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
                                        if(cPage == tPages){
                                            jQuery("#next-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                            jQuery("#next-"+categoryId+"-"+numItem).css("cursor", 'default');
                                            jQuery("#next-"+categoryId+"-"+numItem).css("color", '#ccc');
                                        }
                                    });  
                                    tmpInnerData[nextIndex] = jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").html();
                                    console.log("next ["+outerIndex+"] fill tmpInnerData["+nextIndex+"]");
                                });
                            }
                        });
                    }else{
                        jQuery(".df-block-inner-megamenu-"+categoryId+"-"+numItem).fadeOut().remove();
                        jQuery('.df-loading-'+categoryId+"-"+numItem).hide().remove();
                        // remove style in prev link
                        jQuery("#prev-"+categoryId+"-"+numItem).removeAttr( "style" );

                        console.log("next ["+outerIndex+"] get from json ");
                        // add next content to .df-block-megamenu-[cat id]-[no item]
                        jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").prepend(tmpData[outerIndex][nextIndex]).fadeIn('slow', function(){
                            cPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
                            tPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
                            if(cPage == tPages){
                                jQuery("#next-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                jQuery("#next-"+categoryId+"-"+numItem).css("cursor", 'default');
                                jQuery("#next-"+categoryId+"-"+numItem).css("color", '#ccc');
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
                            no_item: numItem,
                            category_id: categoryId,
                            total_pages: totalPages,
                            posts_per_page: postsPerPage,
                            current_page: currentPage,
                            has_sub_cat: hasSubCat,
                            type: 'next'
                        },
                        beforeSend: function(){
                            jQuery("#next-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                            jQuery("#next-"+categoryId+"-"+numItem).css("cursor", 'default');
                            jQuery("#next-"+categoryId+"-"+numItem).css("color", '#ccc');
                            // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                            // console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                            jQuery(".df-block-inner-megamenu-"+categoryId+"-"+numItem).fadeOut().remove();
                            jQuery(".df-loading-"+categoryId+"-"+numItem).show();
                        },
                        success: function(data){
                            jQuery("#next-"+categoryId+"-"+numItem).removeAttr( "style" );
                            jQuery('.df-loading-'+categoryId+"-"+numItem).hide(function(){
                                // remove style in prev link
                                jQuery("#prev-"+categoryId+"-"+numItem).removeAttr( "style" );
                                // add next content to .df-block-megamenu-[cat id]-[no item]
                                jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").prepend(data).fadeIn('slow', function(){
                                    cPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
                                    tPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
                                    if(cPage == tPages){
                                        jQuery("#next-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                        jQuery("#next-"+categoryId+"-"+numItem).css("cursor", 'default');
                                        jQuery("#next-"+categoryId+"-"+numItem).css("color", '#ccc');
                                    }
                                    tmpInnerData[nextIndex] = jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").html();
                                    console.log("next ["+outerIndex+"] fill tmpInnerData["+nextIndex+"]");
                                });  
                                
                            });
                            
                            
                        }
                    });
                }
                
                tmpOuterIndex = outerIndex;
                tmpCurrentPage = nextIndex;
                tmpCatId = categoryId;
                tmpNumItem = numItem;
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

            numItem = jQuery(this).data('item');  
            categoryId = jQuery(this).data('cat');
            totalPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
            postsPerPage = jQuery(".df-posts-per-page-"+categoryId+"-"+numItem).val();
            currentPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
            hasSubCat = jQuery(".df-has-sub-cat-"+categoryId+"-"+numItem).val();
            // categoryId = jQuery(".category_id-" +numItem).val();

            prevIndex = parseInt(currentPage) - 1;
            outerIndex = "df-megamenu-"+categoryId+"-"+numItem;

            console.log("cat: "+categoryId+", no item: "+numItem);

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
                        tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                        console.log("prev ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                    }else{
                        console.log("tmpOuterIndex != outerIndex");
                        if(subCat == "true"){
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+tmpCatId+"-"+tmpNumItem+" .row-inner").html();
                        }else{
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+tmpCatId+"-"+tmpNumItem+" .row").html();
                        }
                        //tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+tmpCatId+"-"+tmpNumItem+" .row").html();
                        
                        tmpData[outerIndex][currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
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
                                no_item: numItem,
                                category_id: categoryId,
                                total_pages: totalPages,
                                posts_per_page: postsPerPage,
                                current_page: currentPage,
                                has_sub_cat: hasSubCat,
                                type: 'prev'
                            },
                            beforeSend: function(){
                                // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                                // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                                jQuery(".df-block-inner-megamenu-"+categoryId+"-"+numItem).fadeOut().remove();
                                jQuery(".df-loading-"+categoryId+"-"+numItem).show();
                            },
                            success: function(data){
                                jQuery('.df-loading-'+categoryId+"-"+numItem).hide(function(){
                                    jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").prepend(data).fadeIn('slow', function(){
                                        cPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
                                        tPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
                                        if(cPage == '1'){
                                            jQuery("#prev-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                            jQuery("#prev-"+categoryId+"-"+numItem).css("cursor", 'default');
                                            jQuery("#prev-"+categoryId+"-"+numItem).css("color", '#ccc');
                                            // remove style in prev link
                                            jQuery("#next-"+categoryId+"-"+numItem).removeAttr( "style" );
                                        }
                                    });  
                                });
                            }
                        })
                    }else{
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                        // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                        jQuery(".df-block-inner-megamenu-"+categoryId+"-"+numItem).fadeOut().remove();
                        jQuery('.df-loading-'+categoryId+"-"+numItem).hide().remove();

                        console.log("prev ["+outerIndex+"] get from json ");

                        jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").prepend(tmpData[outerIndex][prevIndex]).fadeIn('slow', function(){
                            cPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
                            tPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
                            if(cPage < tPages){

                                if(cPage == '1'){
                                    jQuery("#prev-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                    jQuery("#prev-"+categoryId+"-"+numItem).css("cursor", 'default');
                                    jQuery("#prev-"+categoryId+"-"+numItem).css("color", '#ccc');
                                    // remove style in prev link
                                    jQuery("#next-"+categoryId+"-"+numItem).removeAttr( "style" );
                                }else{
                                    jQuery("#next-"+categoryId+"-"+numItem).removeAttr( "style" );
                                    jQuery("#prev-"+categoryId+"-"+numItem).removeAttr( "style" );
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
                            no_item: numItem,
                            category_id: categoryId,
                            total_pages: totalPages,
                            posts_per_page: postsPerPage,
                            current_page: currentPage,
                            has_sub_cat: hasSubCat,
                            type: 'prev'
                        },
                        beforeSend: function(){
                            // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                            // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                            jQuery(".df-block-inner-megamenu-"+categoryId+"-"+numItem).fadeOut().remove();
                            jQuery(".df-loading-"+categoryId+"-"+numItem).show();
                        },
                        success: function(data){
                            jQuery('.df-loading-'+categoryId+"-"+numItem).hide(function(){
                                jQuery(".df-block-megamenu-"+categoryId+"-"+numItem+" .row").prepend(data).fadeIn('slow', function(){
                                    cPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
                                    tPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
                                    if(cPage == '1'){
                                        jQuery("#prev-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                        jQuery("#prev-"+categoryId+"-"+numItem).css("cursor", 'default');
                                        jQuery("#prev-"+categoryId+"-"+numItem).css("color", '#ccc');
                                        // remove style in prev link
                                        jQuery("#next-"+categoryId+"-"+numItem).removeAttr( "style" );
                                    }
                                });  
                            });
                        }
                    })
                }

                tmpOuterIndex = outerIndex;
                tmpCurrentPage = prevIndex;
                tmpCatId = categoryId;
                tmpNumItem = numItem;
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
                        tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                        console.log("prev ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                    }else{
                        console.log("tmpOuterIndex != outerIndex");
                        if(subCat == "true"){
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+tmpCatId+"-"+tmpNumItem+" .row-inner").html();
                        }else{
                            tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-block-megamenu-"+tmpCatId+"-"+tmpNumItem+" .row").html();
                        }
                        // tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".df-tab-content-inner-"+tmpCatId+"-"+tmpNumItem+" .row-inner").html();
                        
                        tmpData[outerIndex][currentPage] = jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").html();
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
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
                                no_item: numItem,
                                category_id: categoryId,
                                total_pages: totalPages,
                                posts_per_page: postsPerPage,
                                current_page: currentPage,
                                has_sub_cat: hasSubCat,
                                type: 'prev'
                            },
                            beforeSend: function(){
                                // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                                // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                                jQuery(".df-block-inner-megamenu-"+categoryId+"-"+numItem).fadeOut().remove();
                                jQuery(".df-loading-"+categoryId+"-"+numItem).show();
                            },
                            success: function(data){
                                jQuery('.df-loading-'+categoryId+"-"+numItem).hide(function(){
                                    jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").prepend(data).fadeIn('slow', function(){
                                        cPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
                                        tPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
                                        if(cPage == '1'){
                                            jQuery("#prev-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                            jQuery("#prev-"+categoryId+"-"+numItem).css("cursor", 'default');
                                            jQuery("#prev-"+categoryId+"-"+numItem).css("color", '#ccc');
                                            // remove style in prev link
                                            jQuery("#next-"+categoryId+"-"+numItem).removeAttr( "style" );
                                        }
                                    });  
                                });
                            }
                        })
                    }else{
                        // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                        // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                        jQuery(".df-block-inner-megamenu-"+categoryId+"-"+numItem).fadeOut().remove();
                        jQuery('.df-loading-'+categoryId+"-"+numItem).hide().remove();

                        console.log("prev ["+outerIndex+"] get from json ");

                        jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").prepend(tmpData[outerIndex][prevIndex]).fadeIn('slow', function(){
                            cPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
                            tPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
                            if(cPage < tPages){

                                if(cPage == '1'){
                                    jQuery("#prev-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                    jQuery("#prev-"+categoryId+"-"+numItem).css("cursor", 'default');
                                    jQuery("#prev-"+categoryId+"-"+numItem).css("color", '#ccc');
                                    // remove style in prev link
                                    jQuery("#next-"+categoryId+"-"+numItem).removeAttr( "style" );
                                }else{
                                    jQuery("#next-"+categoryId+"-"+numItem).removeAttr( "style" );
                                    jQuery("#prev-"+categoryId+"-"+numItem).removeAttr( "style" );
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
                            no_item: numItem,
                            category_id: categoryId,
                            total_pages: totalPages,
                            posts_per_page: postsPerPage,
                            current_page: currentPage,
                            has_sub_cat: hasSubCat,
                            type: 'prev'
                        },
                        beforeSend: function(){
                            // tmpInnerData[currentPage] = jQuery(".df-block-megamenu-"+categoryId+"-"+numItem).html();
                            // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                            jQuery(".df-block-inner-megamenu-"+categoryId+"-"+numItem).fadeOut().remove();
                            jQuery(".df-loading-"+categoryId+"-"+numItem).show();
                        },
                        success: function(data){
                            jQuery('.df-loading-'+categoryId+"-"+numItem).hide(function(){
                                jQuery(".df-tab-content-inner-"+categoryId+"-"+numItem+" .row-inner").prepend(data).fadeIn('slow', function(){
                                    cPage = jQuery(".df-current-page-"+categoryId+"-"+numItem).val();
                                    tPages = jQuery(".df-total-pages-"+categoryId+"-"+numItem).val();
                                    if(cPage == '1'){
                                        jQuery("#prev-"+categoryId+"-"+numItem).css("pointer-events", 'none');
                                        jQuery("#prev-"+categoryId+"-"+numItem).css("cursor", 'default');
                                        jQuery("#prev-"+categoryId+"-"+numItem).css("color", '#ccc');
                                        // remove style in prev link
                                        jQuery("#next-"+categoryId+"-"+numItem).removeAttr( "style" );
                                    }
                                });  
                            });
                        }
                    })
                }

                tmpOuterIndex = outerIndex;
                tmpCurrentPage = prevIndex;
                tmpCatId = categoryId;
                tmpNumItem = numItem;
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
