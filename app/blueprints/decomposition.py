from flask import Blueprint, render_template

decomposition_bp = Blueprint('decomposition', __name__, url_prefix='/decomposition')


@decomposition_bp.route('/')
def decomposition():
    return render_template('decomposition.html', viewpoint="Decomposition")
