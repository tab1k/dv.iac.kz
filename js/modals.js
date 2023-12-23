// MODALS

var modal = class {

  constructor(options) {

    var _container = this, options = options || {};
    var overlay = $('<div class="modal-overlay"></div>'), _obj = $('<div class="modal-window"></div>');

    // if ( options.elements.includes('header') ) { _obj.append('<div class="modal-header"><div class="modal-title"></div><div class="modal-close-btn"><svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><g><path d="m25.754019,23.018883l-7.017853,-7.017853l7.017853,-7.017853c0.757669,-0.757669 0.757669,-1.977464 0,-2.735134c-0.757671,-0.75767 -1.977465,-0.75767 -2.735134,0l-7.017853,7.017853l-7.017854,-7.017853c-0.757669,-0.757669 -1.977465,-0.757669 -2.735135,0c-0.757669,0.75767 -0.757669,1.977466 0,2.735135l7.017853,7.017852l-7.017853,7.017853c-0.757669,0.757669 -0.757669,1.977465 0,2.735134c0.75767,0.757669 1.977466,0.757669 2.735135,0l7.017854,-7.017853l7.017853,7.017853c0.757669,0.757669 1.977465,0.757669 2.735134,0c0.752296,-0.757671 0.752296,-1.982838 0,-2.735134z"></path></g></svg></div></div>'); }
    // if ( options.elements.includes('body') ) { _obj.append('<div class="modal-content"></div>'); }
    // if ( options.elements.includes('footer') ) { _obj.append('<div class="modal-footer"></div>'); }

    // title

    _container.headerDOM = $('<div class="modal-header"></div>');
    
    _container.titleDOM = $('<div class="modal-title"></div>');
    _container.headerDOM.append(_container.titleDOM);
    
    _container.headerDOM.append('<div class="modal-close-btn"><svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><g><path d="m25.754019,23.018883l-7.017853,-7.017853l7.017853,-7.017853c0.757669,-0.757669 0.757669,-1.977464 0,-2.735134c-0.757671,-0.75767 -1.977465,-0.75767 -2.735134,0l-7.017853,7.017853l-7.017854,-7.017853c-0.757669,-0.757669 -1.977465,-0.757669 -2.735135,0c-0.757669,0.75767 -0.757669,1.977466 0,2.735135l7.017853,7.017852l-7.017853,7.017853c-0.757669,0.757669 -0.757669,1.977465 0,2.735134c0.75767,0.757669 1.977466,0.757669 2.735135,0l7.017854,-7.017853l7.017853,7.017853c0.757669,0.757669 1.977465,0.757669 2.735134,0c0.752296,-0.757671 0.752296,-1.982838 0,-2.735134z"></path></g></svg></div>');

    _obj.append(_container.headerDOM);

    // contents

    _container.contentDOM = $('<div class="modal-content"></div>');
    _obj.append(_container.contentDOM);

    // footer

    _container.footerDOM = $('<div class="modal-footer"></div>');
    _obj.append(_container.footerDOM);

    // close handlers

    $('.modal-close-btn svg', _obj).click(function() { _container.close(); });

    //

    overlay.append(_obj);
    $('body').append(overlay);

    this.overlay = overlay;
    this.element = _obj;

  }

  close() {

    this.overlay.remove();

  }

}