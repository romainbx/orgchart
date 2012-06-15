module Orgchartgem

  class NodesController < ApplicationController

  layout "application"

    def index
      @nodes = Node.all

      respond_to do |format|
        format.html # index.html.erb
        format.json { render json: @nodes }
      end
    end

    def show
      @node = Node.find(params[:id])

      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @node }
      end
    end
    # DELETE /nodes/1
    # DELETE /nodes/1.json
    def destroy
      @node = Node.find(params[:id])
      @node.destroy

      respond_to do |format|
        format.html { redirect_to orgchart.nodes_path }
        format.json { head :no_content }
      end
    end
  end
end
