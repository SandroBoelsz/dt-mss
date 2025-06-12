from flask import Blueprint, render_template

decomposition_bp = Blueprint('decomposition', __name__, url_prefix='/decomposition')


@decomposition_bp.route('/monolithic-container')
def monolithicContainer():
    return render_template('decomposition.html', viewpoint="Monolithic Container")

@decomposition_bp.route('/fine-grained')
def fineGrained():    
    return render_template('decomposition.html', viewpoint="Fine-grained Components")

@decomposition_bp.route('/coarse-grained')
def coarseGrained():    
    return render_template('decomposition.html', viewpoint="Coarse-grained Components")
