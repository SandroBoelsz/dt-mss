from flask import Blueprint, render_template

metadata_bp = Blueprint('metadata', __name__, url_prefix='/metadata')


@metadata_bp.route('/enrichment')
def enrichment():
    return render_template('metadata.html', viewpoint="Enrichment")


@metadata_bp.route('/final-representation')
def finalRepresentation():
    return render_template('final_representation.html', viewpoint="Final Representation")
